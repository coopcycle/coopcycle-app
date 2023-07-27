//
//  PayerCostRowTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 10/13/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

class PayerCostRowTableViewCell: UITableViewCell {

    @IBOutlet weak var interestDescription: UILabel!
    @IBOutlet weak var installmentDescription: UILabel!

    func fillCell(payerCost: PXPayerCost, showDescription: Bool? = true) {
        let currency = SiteManager.shared.getCurrency()
        if payerCost.installments == 1 {
            self.interestDescription.clearAttributedText()

        } else if payerCost.hasInstallmentsRate() {
            let attributedTotal = NSMutableAttributedString(attributedString: NSAttributedString(string: "(", attributes: [NSAttributedString.Key.foregroundColor: UIColor.px_grayLight()]))
            attributedTotal.append(Utils.getAttributedAmount(payerCost.totalAmount, currency: currency, color: UIColor.px_grayLight(), fontSize: 15, baselineOffset: 3))
            attributedTotal.append(NSAttributedString(string: ")", attributes: [NSAttributedString.Key.foregroundColor: UIColor.px_grayLight()]))

            if showDescription == false {
                interestDescription.attributedText = NSAttributedString(string: "")
            } else {
                interestDescription.attributedText = attributedTotal
            }

        } else {

            if showDescription == false {
                interestDescription.attributedText = NSAttributedString(string: "")
            } else {
                interestDescription.attributedText = NSAttributedString(string: "Sin interés".localized)
            }

        }
        var installmentNumber = String(format: "%i", payerCost.installments)
        installmentNumber = "\(installmentNumber) x "
        let totalAmount = Utils.getAttributedAmount(payerCost.installmentAmount, thousandSeparator: currency.getThousandsSeparatorOrDefault(), decimalSeparator: currency.getDecimalSeparatorOrDefault(), currencySymbol: currency.getCurrencySymbolOrDefault(), color: UIColor.black, centsFontSize: 14, baselineOffset: 5)

        let atribute = [NSAttributedString.Key.font: Utils.getFont(size: 20), NSAttributedString.Key.foregroundColor: UIColor.black]
        let installmentLabel = NSMutableAttributedString(string: installmentNumber, attributes: atribute)

        installmentLabel.append(totalAmount)
        installmentDescription.attributedText = installmentLabel
    }

    func addSeparatorLineToBottom(width: Double, height: Double) {
        let lineFrame = CGRect(origin: CGPoint(x: 0, y: Int(height)), size: CGSize(width: width, height: 0.5))
        let line = UIView(frame: lineFrame)
        line.alpha = 0.6
        line.backgroundColor = UIColor.px_grayLight()
        addSubview(line)
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
