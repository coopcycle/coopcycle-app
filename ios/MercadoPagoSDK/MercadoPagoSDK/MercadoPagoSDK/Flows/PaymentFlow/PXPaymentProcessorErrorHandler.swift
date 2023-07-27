//
//  PXPaymentProcessorErrorHandler.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/06/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/** Handler protocol to manage wrong scenarios related with your custom Processor  */
@objc public protocol PXPaymentProcessorErrorHandler: NSObjectProtocol {
    /** Use this method to make a shake action on the loading progress payment button and change the color to red  */
    @objc func showError()
}
