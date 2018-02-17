'use strict';
import initialData from './data';
import pagination from './utils';

const SortOrderEnum = Object.freeze({
  ASCENDING: 0,
  DESCENDING: 1,
  NONE: 2,
});

class App {
  constructor(data) {
    this.data = data;
    this.currentPage = 1;
    this.rowsPerPage = 10;
    this.pageQuantity = Math.ceil(this.data.length / this.rowsPerPage);
    this.sorted = SortOrderEnum.NONE;
  }

  buildStaticContent = () => {
    const form = document.getElementById('searchForm');
    form.addEventListener('submit', this.search);

    const headers = document.getElementById('headers');

    Object.keys(this.data[0]).forEach(key => {
      const th = document.createElement('th');
      const a = document.createElement('a');
      a.classList.add('sort-by');
      a.innerText = key;
      a.addEventListener('click', () => this.sort(key));
      th.appendChild(a);
      headers.appendChild(th);
    });
  };

  buildDynamicContent = () => {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;

    const onePageData = this.data.slice(start, end);

    this.buildTableRows(onePageData);
    this.buildPaginationLinks();
  };

  buildTableRows = data => {
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

  buildPaginationLinks = () => {
    const pages = document.getElementById('pagination');
    pages.innerHTML = '';

    const previousLink = document.createElement('a');
    previousLink.addEventListener('click', this.updateCurrentPage);
    previousLink.innerText = 'Previous';
    pages.appendChild(previousLink);

    pagination(this.currentPage, this.pageQuantity).forEach(page => {
      if (page !== '...') {
        const href = document.createElement('a');
        href.addEventListener('click', this.updateCurrentPage);
        href.innerText = page;
        if (page === this.currentPage) {
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
    nextLink.addEventListener('click', this.updateCurrentPage);
    nextLink.innerText = 'Next';
    pages.appendChild(nextLink);
  };

  updateCurrentPage = pageHref => {
    const pageValue = pageHref.target.innerText;

    if (pageValue === 'Next' && this.currentPage < this.pageQuantity) {
      this.currentPage++;
    } else if (pageValue === 'Previous' && this.currentPage > 1) {
      this.currentPage--;
    } else if (!isNaN(parseInt(pageValue))) {
      this.currentPage = parseInt(pageValue);
    }

    this.buildDynamicContent();
  };

  search = event => {
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
      this.data = filteredData.slice();
    } else {
      this.data = initialData.slice();
      this.sorted = SortOrderEnum.NONE;
    }

    this.pageQuantity = Math.ceil(this.data.length / this.rowsPerPage);
    this.currentPage = 1;

    this.buildDynamicContent();
    event.preventDefault();
    return false;
  };

  sort = sortedField => {
    this.sorted =
      this.sorted === SortOrderEnum.ASCENDING
        ? SortOrderEnum.DESCENDING
        : SortOrderEnum.ASCENDING;

    this.data.stableSort((a, b) => {
      let comp1 = a[sortedField];
      let comp2 = b[sortedField];

      comp1 = isNaN(comp1) ? comp1.toLowerCase() : comp1;
      comp2 = isNaN(comp2) ? comp2.toLowerCase() : comp2;

      if (comp1 > comp2) {
        return this.sorted === SortOrderEnum.ASCENDING ? 1 : -1;
      } else if (comp1 < comp2) {
        return this.sorted === SortOrderEnum.ASCENDING ? -1 : 1;
      } else {
        return 0;
      }
    });

    this.currentPage = 1;
    this.buildDynamicContent();
  };
}

window.addEventListener('load', () => {
  const application = new App(initialData.slice());
  application.buildStaticContent();
  application.buildDynamicContent();
});
