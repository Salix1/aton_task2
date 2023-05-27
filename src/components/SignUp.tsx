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

export default function SignUp(
  { authFetch, signUpStatus, setSignUpStatus, setAuthPage}: 
  { authFetch: Function, 
    signUpStatus: string, 
    setSignUpStatus: React.Dispatch<React.SetStateAction<string>>, 
    setAuthPage: React.Dispatch<React.SetStateAction<string>>
  }) {

  React.useEffect(() => {
    // сброс статуса авторизации для того чтобы уведомление о 
    // неправильных данных появлялось заново
    setSignUpStatus('none');
  }, [])

  // обёртка для установки активной страницы авторизации - чтобы передать аргумент
  const changeAuthPageWrap = () => {
    setAuthPage('signIn');
  }

  // обработчик отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authFetch(data.get('email'), data.get('password'), 'register', setSignUpStatus);
  };

  // уведомление о неправильных данных
  function Message() {
    if (signUpStatus === "failed") {
      return <Fade in={signUpStatus ? true : false}>
      <Grid item>
      <Link variant="body2" color="red" underline="none">Введите правильную почту и пароль</Link>
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
            Зарегистрироваться
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="Имя"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Фамилия"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Электронная почта"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Зарегистрироваться
            </Button>
            <Grid container>
              <Grid item xs>
                <Link sx={{cursor: 'pointer'}} onClick={changeAuthPageWrap} variant="body2">
                  Войти
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
