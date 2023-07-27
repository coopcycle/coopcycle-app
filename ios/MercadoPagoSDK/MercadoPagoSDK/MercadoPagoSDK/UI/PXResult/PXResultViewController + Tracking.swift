//
//  PXResultViewController + Tracking.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 21/02/2019.
//

import Foundation

extension PXResultViewController: PXFooterTrackingProtocol {
    func didTapPrimaryAction() {
        trackEvent(path: viewModel.getFooterPrimaryActionTrackingPath())
    }

    func didTapSecondaryAction() {
        trackEvent(path: viewModel.getFooterSecondaryActionTrackingPath())
    }
}

extension PXResultViewController: PXHeaderTrackingProtocol {
    func didTapCloseButton() {
        trackEvent(path: viewModel.getHeaderCloseButtonTrackingPath())
    }
}
