'use strict';
import initialData from './data';
import Table from './table';

window.addEventListener('load', () => {
  new Table().setData(initialData);
});
