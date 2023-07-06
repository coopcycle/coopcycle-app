//
//  PXConfiguratorManager.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 8/7/19.
//

import Foundation

/// :nodoc
@objcMembers
open class PXConfiguratorManager: NSObject {
    // MARK: Internal definitions. (Only PX)
    // PX Biometric
    internal static var biometricProtocol: PXBiometricProtocol = PXBiometricDefault()
    internal static var biometricConfig: PXBiometricConfig = PXBiometricConfig.createConfig()
    internal static func hasSecurityValidation() -> Bool {
        return biometricProtocol.isValidationRequired(config: biometricConfig)
    }

    // PX Flow Behaviour
    internal static var flowBehaviourProtocol: PXFlowBehaviourProtocol = PXFlowBehaviourDefault()

    // MARK: Public
    // Set external implementation of PXBiometricProtocol
    public static func with(biometric biometricProtocol: PXBiometricProtocol) {
        self.biometricProtocol = biometricProtocol
    }

    // Set external implementation of PXFlowBehaviourProtocol
    public static func with(flowBehaviourProtocol: PXFlowBehaviourProtocol) {
        self.flowBehaviourProtocol = flowBehaviourProtocol
    }
}
