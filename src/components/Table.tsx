import React, { useEffect, useMemo, useState } from 'react';

// для таблицы используется библиотека Material React Table
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from 'material-react-table';

import { MRT_Localization_RU } from 'material-react-table/locales/ru';

import Button from '@mui/material/Button';

// для оповещений используется библиотека Notistack
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from 'notistack';

// тип ответа от API
type apiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

// тип данных таблицы
type User = {
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  id: string;
};

const Table = () => {
  // состояния данных и запроса
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(12);

  // состояние таблицы
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      // создание ссылки для запроса
      const url = new URL(
        '/api/users',
        'https://reqres.in/'
      );
      url.searchParams.set(
        'page',
        `${pagination.pageIndex + 1}`,
      );
      url.searchParams.set('per_page', `${pagination.pageSize}`);

      try {
        const startTime = new Date().getTime();
        const response = await fetch(url.href);
        // отсчёт времени, прошедшего с отправки запроса
        const fetchTime = (new Date().getTime() - startTime)/1000;
        // в зависимости от статуса запроса отображается соответствующее уведомление
        response.status < 300 ? enqueueSnackbar(`Данные успешно получены за ${fetchTime} секунд`, {variant: "success"}) :
          (response.status >= 400 && response.status < 500) ? enqueueSnackbar('Ошибка на стороне пользователя', {variant: "error"}) :
          response.status >= 500 ? enqueueSnackbar('Ошибка на стороне сервера', {variant: "error"}) : 
          enqueueSnackbar('Статус запроса неизвестен', {variant: "error"});
        const json = (await response.json()) as apiResponse;
        // данные записываются в соответствующий state
        setData(json.data);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
  ]);


  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      // определение колонок и их заголовков
      {
        accessorKey: 'avatar',
        header: 'Фото',
        Cell: ({ cell }) => (
          <img alt='фото пользователя' src={cell.getValue<string>()}></img>
        ),
      },
      {
        accessorKey: 'first_name',
        header: 'Имя',
      },
      {
        accessorKey: 'last_name',
        header: 'Фамилия',
      },
      {
        accessorKey: 'email',
        header: 'Почта',
      },
      {
        accessorKey: 'id',
        header: 'ID',
      },
    ],
    [],
  );

  return (
    // обёртка для функционирования оповещений
    <SnackbarProvider maxSnack={5} autoHideDuration={5000} anchorOrigin = {{ vertical: "top", horizontal: "right" }} action={(snackbarId) => (
      // формат кнопки для всех оповещений
      <Button
          size='small'
          sx={{
            color: 'white'
          }}
          onClick={() => closeSnackbar(snackbarId)}
      >
          ОК
      </Button>
    )}>
      <MaterialReactTable
        columns={columns}
        data={data}
        localization={MRT_Localization_RU}
        // настройка инструментов и функционала таблицы - не нужные были выключены
        enableRowSelection={false}
        enableColumnResizing={false}
        enableColumnActions={false}
        enableColumnFilters={false}
        enablePagination={true}
        muiTablePaginationProps={{
          rowsPerPageOptions: [],
        }}
        enableSorting={false}
        enableBottomToolbar={true}
        enableTopToolbar={isError? true : false}
        enableToolbarInternalActions={false}
        enableStickyHeader={true}
        muiTableHeadRowProps={{
          sx: {
            height: '50px'
          }
        }}
        muiTableHeadCellProps={{
          sx: {
            fontSize: '35px'
          }
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: '18px'
          }
        }}
        getRowId={(row) => row.id}
        manualPagination
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Ошибка при загрузке данных',
              }
            : undefined
        }
        onPaginationChange={setPagination}
        rowCount={rowCount}
        state={{
          isLoading,
          pagination,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
      />
    </SnackbarProvider>
  );
};

export default Table;
