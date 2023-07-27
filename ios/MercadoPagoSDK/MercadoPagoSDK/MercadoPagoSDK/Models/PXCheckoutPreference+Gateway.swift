//
//  PXCheckoutPreference+Gateway.swift
//  MercadoPagoSDK
//
//  Created by Federico Bustos Fierro on 31/05/2019.
//

import UIKit

// MARK: Gateway mode
extension PXCheckoutPreference {
    /**
     - parameter processingModes: Supported proccesing modes by the preference. On a first instance this field can support aggregator and gateway modes. If this setter is not used aggregator only support will be infered.
     */
    public func setGatewayProcessingModes(_ processingModes: [String]) {
        self.processingModes = processingModes
    }

    /**
     - parameter branchId: This field can be used optionally to customize the gateway mode experience.
     */
    public func setGatewayBranchId(_ branchId: String) {
        self.branchId = branchId
    }

    /**
     getProcessingModes
     */
    open func getProcessingModes() -> [String] {
        return self.processingModes
    }

    /**
     getBranchId
     */
    open func getBranchId() -> String? {
        return self.branchId
    }
}
