import { useState, useEffect } from 'react';
import { 
    Box, Button, Container, TextField, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import { getToDoList, postCreateTodo, patchCheckTodo, deleteTodo } from '../../common/api/todo';

const Top = () => {

    const [todoList, setTodoList] = useState([]);

    const [todoName, setTodoName] = useState('');

    useEffect(() => {
        (async () => {
            const list = await getToDoList();
            setTodoList(list)
        })();
    }, []);

    const handleSetTodo = (e) => {
        setTodoName(e.target.value);
    }
    
    const handleCreate = async () => {
        if ( todoName === '' || todoList.some( value => todoName === value.name ) ) return;
        await postCreateTodo(todoName);
        setTodoList(await getToDoList());
        setTodoName('');
    }

    const handleCheck = (e) => {
        const todoId = e.target.value;
        const checked = e.target.checked;
        const list = todoList.map( (value, index) => {
            if (value.id.toString() === todoId) {
                todoList[index].checked = checked;
            }
            return todoList[index];
        });
        setTodoList(list)
        patchCheckTodo(todoId, checked);
    }

    const handleDelete = (todoId) => {
        const list = todoList.filter( value => value.id !== todoId);
        setTodoList(list);
        deleteTodo(todoId);
    }

    return (
        <Container maxWidth="xs">
            <Box display="flex" justifyContent="space-between" mt={4} mb={4}>
                <TextField 
                    label="やること" 
                    variant="outlined" 
                    size="small" 
                    value={todoName}
                    onChange={handleSetTodo} />
                <Button variant="contained" color="primary" onClick={handleCreate}>作成</Button>
            </Box>
            <FormGroup>
                {todoList.map((todo, index) => {
                    return (
                        <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                            <FormControlLabel 
                              control={
                              <Checkbox value={todo.id} onChange={handleCheck} checked={todo.checked ? true : false} />
                              }
                              label={todo.name}
                            />
                            <Button variant="outlined" onClick={() => handleDelete(todo.id)}>削除</Button>
                        </Box>
                    )
                })}
            </FormGroup>
        </Container>
    )
}

export default Top;