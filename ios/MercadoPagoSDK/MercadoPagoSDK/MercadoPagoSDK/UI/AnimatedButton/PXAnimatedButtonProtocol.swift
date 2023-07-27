//
//  PXAnimatedButtonProtocol.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 23/07/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation
protocol PXAnimatedButtonDelegate: NSObjectProtocol {
    func expandAnimationInProgress()
    func didFinishAnimation()
    func progressButtonAnimationTimeOut()
    func shakeDidFinish()
}
