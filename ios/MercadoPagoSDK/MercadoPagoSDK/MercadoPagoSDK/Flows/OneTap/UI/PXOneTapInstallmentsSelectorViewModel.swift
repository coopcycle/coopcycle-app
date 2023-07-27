//
//  PXOneTapInstallmentsSelectorViewModel.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 30/10/18.
//

import Foundation

typealias PXOneTapInstallmentsSelectorData = (title: NSAttributedString, topValue: NSAttributedString?, bottomValue: NSAttributedString?, isSelected: Bool)

final class PXOneTapInstallmentsSelectorViewModel {
    let installmentData: PXInstallment
    let selectedPayerCost: PXPayerCost?
    let interest: PXInstallmentsConfiguration?
    let reimbursement: PXInstallmentsConfiguration?

    var selectedRowHeight: CGFloat?

    init(installmentData: PXInstallment, selectedPayerCost: PXPayerCost?, interest: PXInstallmentsConfiguration?, reimbursement: PXInstallmentsConfiguration?) {
        self.installmentData = installmentData
        self.selectedPayerCost = selectedPayerCost
        self.interest = interest
        self.reimbursement = reimbursement
    }

    func numberOfRowsInSection(_ section: Int) -> Int {
        return installmentData.payerCosts.count
    }

    func cellForRowAt(_ indexPath: IndexPath) -> UITableViewCell {
        let cell = PXOneTapInstallmentsSelectorCell()
        if let payerCost = getPayerCostForRowAt(indexPath) {
            var isSelected = false
            if let selectedPayerCost = selectedPayerCost, selectedPayerCost == payerCost {
                isSelected = true
            }
            let data = getDataFor(payerCost: payerCost, isSelected: isSelected)
            cell.updateData(data)
            cell.backgroundColor = .white
            return cell
        }
        return cell
    }

    func heightForRowAt(_ indexPath: IndexPath) -> CGFloat {
        if let selectedRowHeight = selectedRowHeight {
            return selectedRowHeight
        }
        let filteredPayerCosts = installmentData.payerCosts.filter { (payerCost) -> Bool in
            let hasReimbursementText = getReimbursementText(payerCost: payerCost) != nil
            return hasReimbursementText
        }
        if filteredPayerCosts.first != nil {
            selectedRowHeight = PXOneTapInstallmentInfoView.HIGH_ROW_HEIGHT
            return PXOneTapInstallmentInfoView.HIGH_ROW_HEIGHT
        }
        selectedRowHeight = PXOneTapInstallmentInfoView.DEFAULT_ROW_HEIGHT
        return PXOneTapInstallmentInfoView.DEFAULT_ROW_HEIGHT
    }

    func getTotalAmountFormetted(payerCost: PXPayerCost, currency: PXCurrency, showDescription: Bool) -> NSAttributedString? {
        let fontSize = PXLayout.XS_FONT
        let fontColor = ThemeManager.shared.greyColor()
        let attributes: [NSAttributedString.Key: AnyObject] = [
            NSAttributedString.Key.font: Utils.getFont(size: fontSize),
            NSAttributedString.Key.foregroundColor: fontColor
        ]

        if payerCost.installments != 1 {
            let formattedAmount = Utils.getAttributedAmount(payerCost.totalAmount, currency: currency, color: fontColor, fontSize: fontSize, centsFontSize: fontSize, baselineOffset: 0)

            let string = showDescription ? "(\(formattedAmount.string))" : ""
            return NSAttributedString(string: string, attributes: attributes)
        }
        return nil
    }

    func getRowTitle(payerCost: PXPayerCost, currency: PXCurrency) -> NSAttributedString {
        let fontSize = PXLayout.XS_FONT
        let fontColor = UIColor.black
        let attributes: [NSAttributedString.Key: AnyObject] = [
            NSAttributedString.Key.font: Utils.getFont(size: fontSize),
            NSAttributedString.Key.foregroundColor: fontColor
        ]

        let formattedTotalAmount = Utils.getAttributedAmount(payerCost.installmentAmount, thousandSeparator: currency.getThousandsSeparatorOrDefault(), decimalSeparator: currency.getDecimalSeparatorOrDefault(), currencySymbol: currency.getCurrencySymbolOrDefault(), color: fontColor, fontSize: fontSize, centsFontSize: fontSize, baselineOffset: 0)

        let string = "\(payerCost.installments) x \(formattedTotalAmount.string)"
        return NSAttributedString(string: string, attributes: attributes)
    }

    func getDataFor(payerCost: PXPayerCost, isSelected: Bool) -> PXOneTapInstallmentsSelectorData {
        let currency = SiteManager.shared.getCurrency()

        let title = getRowTitle(payerCost: payerCost, currency: currency)
        let totalAmount = getTotalAmountFormetted(payerCost: payerCost, currency: currency, showDescription: MercadoPagoCheckout.showPayerCostDescription())

        //Top & Bottom value
        let topValue = getInterestText(payerCost: payerCost)?.getAttributedString(fontSize: PXLayout.XS_FONT, backgroundColor: .clear) ?? totalAmount
        let bottomValue = getReimbursementText(payerCost: payerCost)?.getAttributedString(fontSize: PXLayout.XXS_FONT, backgroundColor: .clear)

        return PXOneTapInstallmentsSelectorData(title, topValue, bottomValue, isSelected)
    }

    func getPayerCostForRowAt(_ indexPath: IndexPath) -> PXPayerCost? {
        return installmentData.payerCosts[indexPath.row]
    }

    func getReimbursementText(payerCost: PXPayerCost) -> PXText? {
        guard let reimbursementConfiguration = reimbursement else {
            return nil
        }

        if reimbursementConfiguration.appliedInstallments.contains(payerCost.installments) {
            return reimbursementConfiguration.installmentRow
        }
        return nil
    }

    func getInterestText(payerCost: PXPayerCost) -> PXText? {
        guard let interestConfiguration = interest else {
            return nil
        }

        if interestConfiguration.appliedInstallments.contains(payerCost.installments) {
            return interestConfiguration.installmentRow
        }
        return nil
    }
}
