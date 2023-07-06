//
//  PXTrackingSettings.swift
//  MercadoPagoPXTracking
//
//  Created by Eden Torres on 11/8/17.
//  Copyright © 2017 Mercado Pago. All rights reserved.
//

import Foundation
internal class PXTrackingSettings: NSObject {

    static let eventsTrackingVersion = "2"

    internal class func enableBetaServices() {
        PXTrackingURLConfigs.MP_SELECTED_ENV = PXTrackingURLConfigs.MP_TEST_ENV
    }
}
