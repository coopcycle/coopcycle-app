//
//  PXServicesSettings.swift
//  MercadoPagoServices
//
//  Created by Eden Torres on 11/8/17.
//  Copyright © 2017 Mercado Pago. All rights reserved.
//

import Foundation
/// :nodoc:
internal class PXServicesSettings: NSObject {

    internal class func enableBetaServices() {
        PXServicesURLConfigs.MP_SELECTED_ENV = PXServicesURLConfigs.MP_TEST_ENV
    }
}
