//
//  PXLazyInitProtocol.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Use `PXLazyInitProtocol` to start the checkout init services in lazy mode (without UI). Implement this protocol and keep you informed when the checkout is ready to launch.
 */
@objc public protocol PXLazyInitProtocol: NSObjectProtocol {
    /**
     Init checkout methods finished. The checkout is ready to start. You receive the `MercadoPagoCheckout` reference.
     - parameter checkout: Checkout reference.
     */
    func didFinish(checkout: MercadoPagoCheckout)
    /**
     Init checkout methods fail.
     - parameter checkout: Checkout reference.
     */
    func failure(checkout: MercadoPagoCheckout)
}
