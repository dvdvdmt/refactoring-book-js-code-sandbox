class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  static for(performance, play) {
    switch (play.type) {
      case 'tragedy':
        return new TragedyCalculator(performance, play);
      case 'comedy':
        return new ComedyCalculator(performance, play);
    }
    return new PerformanceCalculator(performance, play);
  }

  get audience() {
    return this.performance.audience;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case 'tragedy':
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = Math.max(this.performance.audience - 30, 0);
    if ('comedy' === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }
    return result;
  }
}
class TragedyCalculator extends PerformanceCalculator {}
class ComedyCalculator extends PerformanceCalculator {}

export function createStatementData(invoice, plays) {
  let result = {};
  result.performances = invoice.performances.map(enrichPerformance);
  result.customer = invoice.customer;
  result.totalAmount = totalAmount(result);
  result.volumeCredits = totalVolumeCredits(result);
  return result;

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function enrichPerformance(performance) {
    return PerformanceCalculator.for({...performance}, playFor(performance));
  }
}
