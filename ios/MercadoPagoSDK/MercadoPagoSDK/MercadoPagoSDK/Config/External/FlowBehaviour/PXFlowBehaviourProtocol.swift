//
//  PXFlowBehaviourProtocol.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 10/02/2020.
//

import Foundation

@objc public enum PXResultKey: Int {
    case SUCCESS
    case FAILURE
    case PENDING
}

@objc public protocol PXFlowBehaviourProtocol: NSObjectProtocol {
    func trackConversion()

    func trackConversion(result: PXResultKey)
}
