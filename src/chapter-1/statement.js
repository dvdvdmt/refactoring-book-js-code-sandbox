export const plays = {
  hamlet: {
    name: 'Hamlet',
    type: 'tragedy',
  },
  'as-like': {
    name: 'As You Like It',
    type: 'comedy',
  },
  othello: {
    name: 'Othello',
    type: 'tragedy',
  },
};

export const invoices = [
  {
    customer: 'BigCo',
    performances: [
      {
        playID: 'hamlet',
        audience: 55,
      },
      {
        playID: 'as-like',
        audience: 35,
      },
      {
        playID: 'othello',
        audience: 40,
      },
    ],
  },
];

function usd(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number / 100);
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${
      perf.audience
    } seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.volumeCredits} credits\n`;
  return result;
}

function createStatementData(invoice, plays) {
  let statementData = {};
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.customer = invoice.customer;
  statementData.totalAmount = totalAmount(statementData);
  statementData.volumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + amountFor(p), 0);
  }

  function amountFor(performance) {
    let result = 0;
    switch (performance.play.type) {
      case 'tragedy':
        result = 40000;
        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${performance.play.type}`);
    }
    return result;
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function volumeCreditsFor(performance) {
    let result = Math.max(performance.audience - 30, 0);
    if ('comedy' === performance.play.type) {
      result += Math.floor(performance.audience / 5);
    }
    return result;
  }

  function enrichPerformance(performance) {
    let result = {...performance};
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
}

export function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice, plays));
}
