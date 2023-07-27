//
//  PXReviewConfirmDynamicViewsConfiguration.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 19/10/18.
//

import Foundation

@objc public protocol PXReviewConfirmDynamicViewsConfiguration: NSObjectProtocol {
    @objc func topCustomViews(store: PXCheckoutStore) -> [UIView]?
    @objc func bottomCustomViews(store: PXCheckoutStore) -> [UIView]?
}
