//
//  PXFooterView + Tracking.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 21/02/2019.
//

import Foundation

protocol PXFooterTrackingProtocol: NSObjectProtocol {
    func didTapPrimaryAction()
    func didTapSecondaryAction()
}
