import * as React from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Table from './components/Table';

function App() {

  // статус авторизации
  const [logInStatus, setLogInStatus] = React.useState('none');
  const [signUpStatus, setSignUpStatus] = React.useState('none');

  // статуc того, загрузилась ли страница или нет
  const [loaded, setLoaded] = React.useState(false);

  // активная страницы авторизации - вход или регистрация
  const [authPage, setAuthPage] = React.useState('signIn');

  React.useEffect(() => {
    alert('Почта для успешного запроса: george.bluth@reqres.in \nПароль может быть любой')
    setLoaded(true);
  }, [])


  // функция запроса по авторизации, которая работает как с входом так и с регистрацией
  const authFetch = async (
      email: string, 
      password: string, 
      path: string, 
      // аргумент, который представляет переданную set-функцию
      stateChanger: React.Dispatch<React.SetStateAction<string>>
    ): Promise<void> => {
    stateChanger('checking');
    await fetch(`https://reqres.in/api/${path}`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
    // если сервер отвечает что запрос выполнен успешно, меняем статус авторизации на "пройдена"
    .then(response => {
      response.status === 200 ? stateChanger('passed') : stateChanger('failed');
    })
    .catch(error => console.error(error))
  };

  // проверка на прохождение авторизации - если не пройден ни вход в аккаунт ни регистрация,
  // то рендерится активное окно авторизации, иначе рендерится таблица
  if ((logInStatus !== "passed") && (signUpStatus !== "passed")) {
    if (authPage === "signIn") {
      return(
        <>
        {loaded && 
        <SignIn 
          authFetch={authFetch} 
          logInStatus={logInStatus} 
          setLogInStatus={setLogInStatus} 
          setAuthPage={setAuthPage}/>
        }
        </>
      )
    }
    return(
      <>
        {loaded && 
        <SignUp 
          authFetch={authFetch} 
          signUpStatus={signUpStatus} 
          setSignUpStatus={setSignUpStatus} 
          setAuthPage={setAuthPage}/>
        }
      </>
    )
  }

  return(
    <>
    <Table/>
    </>
  )

}

export default App;
