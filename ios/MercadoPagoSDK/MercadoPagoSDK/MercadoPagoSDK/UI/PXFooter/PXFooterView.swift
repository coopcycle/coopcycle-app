//
//  PXFooterView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 16/5/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

final class PXFooterView: UIView {
    weak var delegate: PXFooterTrackingProtocol?
    public var principalButton: PXAnimatedButton?
    public var linkButton: PXSecondaryButton?
}
