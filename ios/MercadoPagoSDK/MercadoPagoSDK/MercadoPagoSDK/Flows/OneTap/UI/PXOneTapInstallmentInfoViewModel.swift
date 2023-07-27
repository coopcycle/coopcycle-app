//
//  PXOneTapInstallmentInfoViewModel.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/10/18.
//

import Foundation

final class PXOneTapInstallmentInfoViewModel {
    var text: NSAttributedString
    var installmentData: PXInstallment?
    var selectedPayerCost: PXPayerCost?
    var shouldShowArrow: Bool
    var status: PXStatus
    let benefits: PXBenefits?
    let shouldShowInstallmentsHeader: Bool

    init(text: NSAttributedString, installmentData: PXInstallment?, selectedPayerCost: PXPayerCost?, shouldShowArrow: Bool, status: PXStatus, benefits: PXBenefits?, shouldShowInstallmentsHeader: Bool) {
        self.text = text
        self.installmentData = installmentData
        self.selectedPayerCost = selectedPayerCost
        self.shouldShowArrow = shouldShowArrow
        self.status = status
        self.benefits = benefits
        self.shouldShowInstallmentsHeader = shouldShowInstallmentsHeader
    }
}
