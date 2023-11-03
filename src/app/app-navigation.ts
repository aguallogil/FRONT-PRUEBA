export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: 'Catalogos',
    icon: 'folder',
    items: [
      {
        text: 'Tipos clientes',
        path: '/tipo-cliente'
      },
      {
        text: 'Clientes',
        path: '/cliente'
      },
      {
        text: 'Productos',
        path: '/producto'
      }
    ]
  },
  {
    text: 'Movimientos',
    icon: 'movetofolder',
    items: [
      {
        text: 'Facturas',
        path: '/factura'
      }
    ]
  },
];
