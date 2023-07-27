//
//  PXHeaderView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 21/02/2019.
//

import UIKit

internal final class PXHeaderView: PXComponentView {
    weak var delegate: PXHeaderTrackingProtocol?
    var circleImage: PXUIImageView?
    var badgeImage: PXAnimatedImageView?
    var statusLabel: UILabel?
    var messageLabel: UILabel?
    var closeButton: UIButton?
}
