//
//  PXHookStep.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 11/28/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

@objc internal enum PXHookStep: Int {
    case BEFORE_PAYMENT_METHOD_CONFIG = 1
    case AFTER_PAYMENT_METHOD_CONFIG
    case BEFORE_PAYMENT
}
