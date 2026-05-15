const AZUL = 'rgb(25, 79, 142)';
const TEAL = 'rgb(13, 110, 90)';
const TERRA = 'rgb(181, 68, 26)';
const YELLOW = 'rgb(196, 137, 42)';
const GRAY = 'rgb(136, 135, 128)';

/* Revelar elementos */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

/* Animación del contador */
function animateCounter(el, target, suffix) {
  let start = 0;
  const dur = 1800;
  const step = 16;
  const inc = target / (dur / step);
  const timer = setInterval(() => {
    start = Math.min(start + inc, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, step);
}
const counterEl = document.getElementById('cancelCounter');
const counterObs = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) { animateCounter(counterEl, 37, '%'); counterObs.disconnect(); }
}, { threshold: 0.5 });
counterObs.observe(counterEl);

/* Gráficos por defecto */
Chart.defaults.font.family = "'Source Sans 3', sans-serif";
Chart.defaults.color = 'rgb(107, 92, 64)';

/* Gráfico por país */
new Chart(document.getElementById('countryChart'), {
  type: 'bar',
  data: {
    labels: ['PRT','GBR','FRA','ESP','DEU','ITA','IRL','NLD','BRA','USA'],
    datasets: [
      { label: 'Hotel Urbano (Lisboa)', data: [29951, 5293, 8762, 4580, 6054, 3293, 1208, 1587, 1784, 1893],
        backgroundColor: AZUL, borderRadius: 4 },
      { label: 'Resort (Algarve)', data: [17073, 6758, 1597, 3908, 1192, 456, 2161, 512, 426, 441],
        backgroundColor: TEAL, borderRadius: 4 }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { autoSkip: false } },
      y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { callback: v => (v/1000)+'K' } }
    }
  }
});

/* Leyenda por país */
document.getElementById('countryChart').insertAdjacentHTML('afterend',
  '<div class="legend" style="margin-top:8px;"><span class="leg-item"><span class="leg-dot" style="background:'+AZUL+'"></span>Hotel Urbano (Lisboa)</span><span class="leg-item"><span class="leg-dot" style="background:'+TEAL+'"></span>Resort (Algarve)</span></div>'
);

/* Gráfico por mes */
new Chart(document.getElementById('monthChart'), {
  type: 'bar',
  data: {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    datasets: [{
      label: 'Reservas',
      data: [5929, 8068, 9794, 11089, 11791, 10939, 12661, 13877, 8167, 11160, 6794, 7330],
      backgroundColor: (ctx) => {
        const v = ctx.dataset.data[ctx.dataIndex];
        return v > 11000 ? TERRA : v > 9000 ? YELLOW : AZUL;
      },
      borderRadius: 4
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { autoSkip: false } },
      y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { callback: v => (v/1000).toFixed(0)+'K' } }
    }
  }
});

/*Gráfico de ADR */
new Chart(document.getElementById('adrChart'), {
  type: 'line',
  data: {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    datasets: [
      { label: 'Hotel Urbano', data: [88,92,100,108,112,116,118,122,110,105,90,84],
        borderColor: AZUL, backgroundColor: 'rgba(27,79,138,0.08)', fill: true,
        tension: 0.4, pointRadius: 4, pointBackgroundColor: AZUL,
        borderDash: [] },
      { label: 'Resort', data: [52,58,70,90,110,130,145,150,120,90,62,50],
        borderColor: TEAL, backgroundColor: 'rgba(13,110,90,0.08)', fill: true,
        tension: 0.4, pointRadius: 4, pointBackgroundColor: TEAL,
        borderDash: [5,4] }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { autoSkip: false } },
      y: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { callback: v => '€'+v } }
    }
  }
});

/* Cancelaciones */
new Chart(document.getElementById('cancelByCountry'), {
  type: 'bar',
  data: {
    labels: ['PRT','ESP','ITA','DEU','NLD','FRA','BRA','USA','CHE','AUT','SWE','GBR','CHN','BEL','IRL'],
    datasets: [{
      label: 'Tasa de cancelación (%)',
      data: [55, 42, 38, 35, 33, 30, 28, 26, 25, 24, 22, 18, 18, 17, 15],
      backgroundColor: (ctx) => {
        const v = ctx.dataset.data[ctx.dataIndex];
        return v > 40 ? TERRA : v > 25 ? YELLOW : TEAL;
      },
      borderRadius: 4
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, max: 65, ticks: { color: 'rgba(250,248,243,.6)', callback: v => v+'%' } },
      y: { grid: { display: false }, ticks: { color: 'rgba(250,248,243,.8)', font: { weight: '600' } } }
    }
  }
});

/* Gráfico de lead time */
new Chart(document.getElementById('leadChart'), {
  type: 'bar',
  data: {
    labels: ['Reservas completadas', 'Reservas canceladas'],
    datasets: [{
      label: 'Lead time medio (días)',
      data: [78, 137],
      backgroundColor: [TEAL, TERRA],
      borderRadius: 6
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.raw + ' días de antelación' } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, max: 160, ticks: { color: 'rgba(250,248,243,.6)', callback: v => v+' días' } },
      y: { grid: { display: false }, ticks: { color: 'rgba(250,248,243,.8)', font: { size: 13 } } }
    }
  }
});

/* Gráfico por tipos de estancia */
new Chart(document.getElementById('stayTypeChart'), {
  type: 'doughnut',
  data: {
    labels: ['Vacaciones','Trabajo','Trabajo+descanso','Fin de semana','Paquete semanal'],
    datasets: [{
      data: [4.1, 43.0, 46.8, 5.8, 0.3],
      backgroundColor: [AZUL, TERRA, YELLOW, TEAL, GRAY],
      hoverOffset: 6, borderWidth: 2, borderColor: 'rgb(250, 248, 243)'
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 12 }, boxWidth: 12 } } }
  }
});

/* Gráfico por alimentación   */
new Chart(document.getElementById('mealChart'), {
  type: 'doughnut',
  data: {
    labels: ['Alojamiento+desayuno (BB)','Media pensión (HB)','Solo alojamiento (SC)','Pensión completa (FB)'],
    datasets: [{
      data: [78.08, 12.23, 9.02, 0.67],
      backgroundColor: [AZUL, TEAL, YELLOW, TERRA],
      hoverOffset: 6, borderWidth: 2, borderColor: 'rgb(250, 248, 243)'
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 12 }, boxWidth: 12 } } }
  }
});
