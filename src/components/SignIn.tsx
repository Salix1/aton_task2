import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Fade from '@mui/material/Fade';

const defaultTheme = createTheme();
                    
export default function SignIn(
  { authFetch, logInStatus, setLogInStatus, setAuthPage}: 
  { authFetch: Function, 
    logInStatus: string, 
    setLogInStatus: React.Dispatch<React.SetStateAction<string>>, 
    setAuthPage: React.Dispatch<React.SetStateAction<string>>
  }) {

  React.useEffect(() => {
    // сброс статуса авторизации для того чтобы уведомление о 
    // неправильных данных появлялось заново
    setLogInStatus('none');
  }, [])

  // обёртка для установки активной страницы авторизации - чтобы передать аргумент
  const changeAuthPageWrap = () => {
    setAuthPage('SignUp')
  }

  // обработчик отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authFetch(data.get('email'), data.get('password'), 'login', setLogInStatus);
  };

  // уведомление о неправильных данных
  function Message() {
    if (logInStatus === "failed") {
      return <Fade in={logInStatus ? true : false}>
        <Grid item>
          <Link variant="body2" color="red" underline="none">Неправильная почта или пароль</Link>
        </Grid>
      </Fade>
    } 
    return null;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
            Войти
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Электронная почта"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Войти
            </Button>
            <Grid container>
              <Grid item xs>
                <Link sx={{cursor: 'pointer'}} onClick={changeAuthPageWrap} variant="body2">
                  {"Зарегистрироваться"}
                </Link>
              </Grid>
              <Message/>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
