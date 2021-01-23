class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }
}

export function createStatementData(invoice, plays) {
  let result = {};
  result.performances = invoice.performances.map(enrichPerformance);
  result.customer = invoice.customer;
  result.totalAmount = totalAmount(result);
  result.volumeCredits = totalVolumeCredits(result);
  return result;

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
    const calculator = new PerformanceCalculator(
      performance,
      playFor(performance)
    );
    let result = {...performance};
    result.play = calculator.play;
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
}
