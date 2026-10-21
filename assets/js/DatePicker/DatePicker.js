/**
 * Birth-date picker (Gregorian calendar, Arabic month names)
 * - Scroll-wheel style columns for year, month and day
 * - Touch and mouse drag support
 * - Days per month follow the real calendar, including leap years
 */

(function BirthDatePickerModule() {
  'use strict';

  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  class BirthDatePicker {
    /**
     * @param {HTMLElement} container - element holding the input and the picker markup
     */
    constructor(container) {
      this.config = {
        dragSensitivity: 1.75,
      };
      this._validateContainer(container);
      this._cacheElements(container);
      this._initializeProperties();
      this._setupEventListeners();
      this._renderInitialView();
    }

    _validateContainer(container) {
      if (!(container instanceof HTMLElement)) {
        throw new Error('Invalid container element');
      }
    }

    _cacheElements(container) {
      this.container = container;
      this.input = container.querySelector('.birthdate-input');
      this.picker = container.querySelector('.date-picker');
      this.yearColumn = container.querySelector('.year-column');
      this.monthColumn = container.querySelector('.month-column');
      this.dayColumn = container.querySelector('.day-column');

      if (!this.input || !this.picker || !this.yearColumn || !this.monthColumn || !this.dayColumn) {
        throw new Error('Missing required elements in container');
      }
    }

    _initializeProperties() {
      const currentYear = new Date().getFullYear();
      // Users must be at least 15 years old; offer the 85 years before that
      const latestYear = currentYear - 15;
      this.years = Array.from({ length: 85 }, (_, i) => latestYear - i);

      this.state = {
        selectedYear: currentYear - 30,
        selectedMonth: 0,
        selectedDay: 1,
        isDragging: false,
        draggedColumn: null,
        startY: 0,
        startScrollTop: 0,
      };
    }

    _setupEventListeners() {
      this.input.addEventListener('click', () => this._togglePicker());
      this.container.querySelector('.cancel-btn').addEventListener('click', () => this._togglePicker());
      this.container.querySelector('.confirm-btn').addEventListener('click', () => this._confirmSelection());

      [this.yearColumn, this.monthColumn, this.dayColumn].forEach(column => {
        column.addEventListener('scroll', () => this._handleColumnScroll(column));
        column.addEventListener('mousedown', e => this._handleDragStart(e));
        column.addEventListener('touchstart', e => this._handleDragStart(e), { passive: true });
      });

      document.addEventListener('mousemove', e => this._handleDragMove(e));
      document.addEventListener('touchmove', e => this._handleDragMove(e), { passive: false });
      document.addEventListener('mouseup', () => this._handleDragEnd());
      document.addEventListener('touchend', () => this._handleDragEnd());
    }

    _renderInitialView() {
      this._renderYears();
      this._renderMonths();
      this._renderDays();
      this._scrollToSelectedPositions();
    }

    _renderYears() {
      this.yearColumn.innerHTML = this.years
        .map(year => `<div class="picker-item" data-value="${year}">${year}</div>`)
        .join('');
    }

    _renderMonths() {
      this.monthColumn.innerHTML = MONTHS
        .map((name, index) => `<div class="picker-item" data-value="${index}">${name}</div>`)
        .join('');
    }

    _renderDays() {
      const daysInMonth = this._getDaysInMonth();
      if (this.dayColumn.children.length === daysInMonth) return;

      this.state.selectedDay = Math.min(this.state.selectedDay, daysInMonth);
      this.dayColumn.innerHTML = Array.from(
        { length: daysInMonth },
        (_, i) => `<div class="picker-item" data-value="${i + 1}">${i + 1}</div>`
      ).join('');
      this._scrollToSelected(this.dayColumn, this.state.selectedDay);
    }

    _scrollToSelectedPositions() {
      this._scrollToSelected(this.yearColumn, this.state.selectedYear);
      this._scrollToSelected(this.monthColumn, this.state.selectedMonth);
      this._scrollToSelected(this.dayColumn, this.state.selectedDay);
    }

    _scrollToSelected(column, value) {
      const item = column.querySelector(`[data-value="${value}"]`);
      if (item) {
        const topPos = item.offsetTop - column.offsetHeight / 2 + item.offsetHeight / 2;
        column.scrollTo({ top: topPos, behavior: 'instant' });
      }
    }

    // Day 0 of the next month is the last day of the selected month
    _getDaysInMonth() {
      return new Date(this.state.selectedYear, this.state.selectedMonth + 1, 0).getDate();
    }

    _handleColumnScroll(column) {
      const items = column.querySelectorAll('.picker-item');
      const columnRect = column.getBoundingClientRect();
      const centerY = columnRect.top + columnRect.height / 2;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top <= centerY && itemRect.bottom >= centerY) {
          item.classList.add('selected');
          this._updateSelection(column, item.dataset.value);
        } else {
          item.classList.remove('selected');
        }
      });
    }

    _handleDragStart(e) {
      const column = e.currentTarget;
      this.state.isDragging = true;
      this.state.draggedColumn = column;
      this.state.startY = e.touches ? e.touches[0].clientY : e.clientY;
      this.state.startScrollTop = column.scrollTop;
      column.style.scrollBehavior = 'auto';
      column.style.userSelect = 'none';
    }

    _handleDragMove(e) {
      if (!this.state.isDragging || !this.state.draggedColumn) return;

      e.preventDefault();
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = (y - this.state.startY) * this.config.dragSensitivity;
      const column = this.state.draggedColumn;
      const maxScroll = column.scrollHeight - column.clientHeight;

      column.scrollTop = Math.max(0, Math.min(this.state.startScrollTop - deltaY, maxScroll));
    }

    _handleDragEnd() {
      const column = this.state.draggedColumn;
      if (!column) return;

      this.state.isDragging = false;
      column.style.scrollBehavior = 'smooth';
      column.style.userSelect = '';
      this._handleColumnScroll(column);
      this.state.draggedColumn = null;
    }

    _updateSelection(column, value) {
      const number = parseInt(value, 10);
      if (column === this.yearColumn) {
        this.state.selectedYear = number;
        this._renderDays();
      } else if (column === this.monthColumn) {
        this.state.selectedMonth = number;
        this._renderDays();
      } else {
        this.state.selectedDay = number;
      }
    }

    _togglePicker() {
      this.picker.classList.toggle('active');
      if (this.picker.classList.contains('active')) {
        this._scrollToSelectedPositions();
      }
    }

    _confirmSelection() {
      const pad = num => String(num).padStart(2, '0');
      this.input.value = `${pad(this.state.selectedDay)}/${pad(this.state.selectedMonth + 1)}/${this.state.selectedYear}`;
      this._togglePicker();
    }
  }

  window.initializeBirthDatePickers = function (selector = '.date-picker-container') {
    document.querySelectorAll(selector).forEach(container => {
      try {
        new BirthDatePicker(container);
      } catch (error) {
        console.error('Error initializing date picker:', error);
      }
    });
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  window.initializeBirthDatePickers();
});
