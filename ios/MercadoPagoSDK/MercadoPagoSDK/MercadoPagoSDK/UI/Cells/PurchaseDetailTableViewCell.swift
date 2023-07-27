//
//  PreferenceDescriptionCellTableViewCell.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 4/2/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

internal class PurchaseDetailTableViewCell: UITableViewCell {

    static let ROW_HEIGHT = CGFloat(52)
    static var separatorLine: UIView?

    @IBOutlet weak var purchaseDetailTitle: MPLabel!
    @IBOutlet weak var purchaseDetailAmount: MPLabel!
    @IBOutlet weak var noRateLabel: MPLabel!

    override open func awakeFromNib() {
        super.awakeFromNib()
    }

    override open func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

    internal func fillCell(_ title: String, amount: Double, currency: PXCurrency, payerCost: PXPayerCost? = nil) {
        //Deafult values for cells
        self.purchaseDetailTitle.text = title.localized
        self.purchaseDetailTitle.font = Utils.getFont(size: purchaseDetailTitle.font.pointSize)
        self.purchaseDetailTitle.textColor = ThemeManager.shared.boldLabelTintColor()
        self.purchaseDetailAmount.textColor = ThemeManager.shared.boldLabelTintColor()
        self.noRateLabel.text = ""
        self.noRateLabel.font = Utils.getFont(size: noRateLabel.font.pointSize)
        self.removeFromSuperview()
        var separatorLineHeight = CGFloat(54)

        if payerCost != nil {
            let purchaseAmount = getInstallmentsAmount(payerCost: payerCost!)
            self.purchaseDetailAmount.attributedText = purchaseAmount
            if PurchaseDetailTableViewCell.separatorLine != nil {
                PurchaseDetailTableViewCell.separatorLine!.removeFromSuperview()
            }
            if !payerCost!.hasInstallmentsRate() {
                separatorLineHeight = MercadoPagoCheckout.showPayerCostDescription() ? separatorLineHeight + 26 : separatorLineHeight
                self.noRateLabel.attributedText = NSAttributedString(string: MercadoPagoCheckout.showPayerCostDescription() ? "Sin interés".localized: "")
            }
            let separatorLine = ViewUtils.getTableCellSeparatorLineView(21, posY: separatorLineHeight, width: self.frame.width - 42, height: 1)
            self.addSubview(separatorLine)
        } else {
            self.purchaseDetailAmount.attributedText = Utils.getAttributedAmount(amount, thousandSeparator: currency.getThousandsSeparatorOrDefault(), decimalSeparator: currency.getDecimalSeparatorOrDefault(), currencySymbol: currency.getCurrencySymbolOrDefault(), color: ThemeManager.shared.boldLabelTintColor(), fontSize: 18, centsFontSize: 12, baselineOffset: 5)
            let separatorLine = ViewUtils.getTableCellSeparatorLineView(21, posY: separatorLineHeight, width: self.frame.width - 42, height: 1)
            self.addSubview(separatorLine)
        }
    }

    public static func getCellHeight(payerCost: PXPayerCost? = nil) -> CGFloat {
        if payerCost != nil && !payerCost!.hasInstallmentsRate() {
            return ROW_HEIGHT + 30
        }
        return ROW_HEIGHT
    }

    private func getInstallmentsAmount(payerCost: PXPayerCost) -> NSAttributedString {
        return Utils.getTransactionInstallmentsDescription(payerCost.installments.description, currency: SiteManager.shared.getCurrency(), installmentAmount: payerCost.installmentAmount, color: ThemeManager.shared.boldLabelTintColor(), fontSize: 24, baselineOffset: 8)
    }
}
