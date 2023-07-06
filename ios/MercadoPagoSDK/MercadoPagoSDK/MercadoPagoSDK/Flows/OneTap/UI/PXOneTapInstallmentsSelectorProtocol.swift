//
//  PXOneTapInstallmentsSelectorProtocol.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 5/11/18.
//

import Foundation

protocol PXOneTapInstallmentsSelectorProtocol: NSObjectProtocol {
    func payerCostSelected(_ payerCost: PXPayerCost)
}
