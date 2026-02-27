import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";

describe('RefundRuleFactory', () => {

  it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
    const daysUntilCheckIn = 10;

    const result = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(result).toBeInstanceOf(FullRefund);

  });


  it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
    const daysUntilCheckIn = 4;

    const result = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(result).toBeInstanceOf(PartialRefund);
  });

  it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência",()=>{
    const daysUntilCheckIn = 0;

    const result = RefundRuleFactory.getRefundRule(daysUntilCheckIn);

    expect(result).toBeInstanceOf(NoRefund);
  });

});
