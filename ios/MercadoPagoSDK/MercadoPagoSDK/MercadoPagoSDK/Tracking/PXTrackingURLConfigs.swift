//
//  PXTrackingURLCofigs.swift
//  MercadoPagoPXTracking
//
//  Created by Eden Torres on 11/8/17.
//  Copyright © 2017 Mercado Pago. All rights reserved.
//

import Foundation
internal class PXTrackingURLConfigs: NSObject {

    static let MP_API_BASE_URL_PROD: String =  "https://api.mercadopago.com"
    static var MP_TEST_ENV = "/beta"
    static var MP_PROD_ENV = "/v1"
    static var MP_SELECTED_ENV = MP_PROD_ENV
    static var MP_ENVIROMENT = MP_SELECTED_ENV  + "/checkout"
    static let MP_TRACKING_EVENTS_URI = MP_ENVIROMENT + "/tracking/events"
    static let TRACKING_URL = MP_API_BASE_URL_PROD + MP_TRACKING_EVENTS_URI
    static let headerEventTracking = "Accept-version"
}
