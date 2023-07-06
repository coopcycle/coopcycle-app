//
//  PXFlowBehaviourDefault.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 11/02/2020.
//

import Foundation

/**
 Default PX implementation of Flow Behaviour for public distribution. (No-trackings)
 */
final class PXFlowBehaviourDefault: NSObject, PXFlowBehaviourProtocol {
    func trackConversion() {}

    func trackConversion(result: PXResultKey) {}
}
