'use strict';
import initialData from './data';
import pagination from './utils';

const SortOrderEnum = Object.freeze({ ASCENDING: 0, DESCENDING: 1, NONE: 2 });

let data = initialData.slice();
let currentPage = 1;
let rowsPerPage = 10;
let pageQuantity = Math.ceil(data.length / rowsPerPage);

let sorted = SortOrderEnum.NONE;

const buildStaticContent = () => {
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', search);

  const headers = document.getElementById('headers');

  Object.keys(data[0]).forEach(key => {
    const th = document.createElement('th');
    const a = document.createElement('a');
    a.classList.add('sort-by');
    a.innerText = key;
    a.addEventListener('click', () => sort(key));
    th.appendChild(a);
    headers.appendChild(th);
  });
};

const buildDynamicContent = () => {
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const onePageData = data.slice(start, end);

  buildTableRows(onePageData);
  buildPaginationLinks();
};

const buildTableRows = data => {
  const table = document.getElementById('tableData');
  table.innerHTML = '';

  data.forEach(obj => {
    const tr = document.createElement('tr');
    Object.values(obj).forEach(value => {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(value));
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
};

const buildPaginationLinks = () => {
  const pages = document.getElementById('pagination');
  pages.innerHTML = '';

  const previousLink = document.createElement('a');
  previousLink.addEventListener('click', updateCurrentPage);
  previousLink.innerText = 'Previous';
  pages.appendChild(previousLink);

  pagination(currentPage, pageQuantity).forEach(page => {
    if (page !== '...') {
      const href = document.createElement('a');
      href.addEventListener('click', updateCurrentPage);
      href.innerText = page;
      if (page === currentPage) {
        href.classList.add('active');
      }
      pages.appendChild(href);
    } else {
      const href = document.createElement('a');
      href.innerText = page;
      pages.appendChild(href);
    }
  });

  const nextLink = document.createElement('a');
  nextLink.addEventListener('click', updateCurrentPage);
  nextLink.innerText = 'Next';
  pages.appendChild(nextLink);
};

const updateCurrentPage = pageHref => {
  const pageValue = pageHref.target.innerText;

  if (pageValue === 'Next' && currentPage < pageQuantity) {
    currentPage++;
  } else if (pageValue === 'Previous' && currentPage > 1) {
    currentPage--;
  } else if (!isNaN(parseInt(pageValue))) {
    currentPage = parseInt(pageValue);
  }

  buildDynamicContent();
};

const search = event => {
  const filteredData = [];
  let searchValue = document.getElementById('searchInput').value;

  if (searchValue !== '') {
    searchValue = isNaN(searchValue) ? searchValue : parseInt(searchValue);
    initialData.forEach(obj => {
      Object.values(obj).forEach(value => {
        if (value === searchValue) {
          filteredData.push(obj);
        }
      });
    });
    data = filteredData.slice();
  } else {
    data = initialData.slice();
    sorted = SortOrderEnum.NONE;
  }

  pageQuantity = Math.ceil(data.length / rowsPerPage);
  currentPage = 1;

  buildDynamicContent();
  event.preventDefault();
  return false;
};

const sort = sortedField => {
  sorted =
    sorted === SortOrderEnum.ASCENDING
      ? SortOrderEnum.DESCENDING
      : SortOrderEnum.ASCENDING;

  data.stableSort((a, b) => {
    let comp1 = a[sortedField];
    let comp2 = b[sortedField];

    comp1 = isNaN(comp1) ? comp1.toLowerCase() : comp1;
    comp2 = isNaN(comp2) ? comp2.toLowerCase() : comp2;

    if (comp1 > comp2) {
      return sorted === SortOrderEnum.ASCENDING ? 1 : -1;
    } else if (comp1 < comp2) {
      return sorted === SortOrderEnum.ASCENDING ? -1 : 1;
    } else {
      return 0;
    }
  });

  currentPage = 1;
  buildDynamicContent();
};

window.addEventListener('load', () => {
  buildStaticContent();
  buildDynamicContent();
});
