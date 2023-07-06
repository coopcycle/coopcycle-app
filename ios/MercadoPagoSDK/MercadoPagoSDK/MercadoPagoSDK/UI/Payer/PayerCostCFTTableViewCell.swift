//
//  ConfirmInstallmentsTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 6/30/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PayerCostCFTTableViewCell: UITableViewCell {
    @IBOutlet weak var totalLabel: UILabel!
    @IBOutlet weak var CFTLabel: UILabel!
    @IBOutlet weak var installmentsLabel: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        self.totalLabel.text = ""
        self.CFTLabel.text = ""
        self.installmentsLabel.text = ""
    }
    func fillCell(payerCost: PXPayerCost) {

        fillTotalOrNoInterestLabel(payerCost: payerCost)

        fillInstallmentsLabel(payerCost: payerCost)

        fillCFTLabel(payerCost: payerCost)
    }

    func fillTotalOrNoInterestLabel(payerCost: PXPayerCost) {
        let currency = SiteManager.shared.getCurrency()

        if !payerCost.hasInstallmentsRate() && payerCost.installments != 1 {
            self.totalLabel.attributedText = NSAttributedString(string: "Sin interés".localized, attributes: [NSAttributedString.Key.font: Utils.getFont(size: 14)])
            self.totalLabel.textColor = UIColor.mpGreenishTeal()

        } else if payerCost.installments != 1 {
            let attributedAmount = Utils.getAttributedAmount(payerCost.totalAmount, currency: currency, color: UIColor.px_grayBaseText(), fontSize: 14, baselineOffset: 4)
            let attributedAmountFinal = NSMutableAttributedString(string: "(")
            attributedAmountFinal.append(attributedAmount)
            attributedAmountFinal.append(NSAttributedString(string: ")"))
            self.totalLabel.attributedText = attributedAmountFinal
            self.totalLabel.textColor = UIColor.px_grayLight()
        }
    }

    func fillInstallmentsLabel(payerCost: PXPayerCost) {
        let currency = SiteManager.shared.getCurrency()
        self.installmentsLabel.attributedText = Utils.getTransactionInstallmentsDescription(String(payerCost.installments), currency: currency, installmentAmount: payerCost.installmentAmount, additionalString: NSAttributedString(string: ""), color: UIColor.px_grayBaseText(), fontSize: 20, centsFontSize: 12, baselineOffset: 6)
    }

    func fillCFTLabel(payerCost: PXPayerCost) {
        CFTLabel.textColor = UIColor.px_grayDark()
        CFTLabel.text = payerCost.hasCFTValue() ? "CFT " + payerCost.getCFTValue()! : ""
    }

    func addSeparatorLineToBottom(width: Double, height: Double) {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(height)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        addSubview(line)
    }
}
