//
//  PXOneTapInstallmentInfoViewProtocol.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/11/18.
//

import Foundation

protocol PXOneTapInstallmentInfoViewProtocol: NSObjectProtocol {
    func hideInstallments()
    func showInstallments(installmentData: PXInstallment?, selectedPayerCost: PXPayerCost?, interest: PXInstallmentsConfiguration?, reimbursement: PXInstallmentsConfiguration?)
    func disabledCardTapped(status: PXStatus)
}
