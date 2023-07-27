//
//  PXComponentizable.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 11/28/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

@objc internal protocol PXComponentizable {
    func render() -> UIView
    @objc optional func oneTapRender() -> UIView
}

internal protocol PXXibComponentizable {
    func xibName() -> String
    func containerView() -> UIView
    func renderXib() -> UIView
}
