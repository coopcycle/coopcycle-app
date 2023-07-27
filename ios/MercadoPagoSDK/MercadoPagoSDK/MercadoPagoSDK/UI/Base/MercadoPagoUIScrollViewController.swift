//
//  MercadoPagoUIScrollViewController.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 11/7/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

// TODO: Deprecate after PaymentVault & AditionalStep redesign/refactor.
internal class MercadoPagoUIScrollViewController: MercadoPagoUIViewController {
    var lastContentOffset: CGFloat = 0
    var scrollingDown = false
    let navBarHeigth: CGFloat = 44
    let statusBarHeigth: CGFloat = ViewUtils.getStatusBarHeightForScrolling()
    var titleCellHeight: CGFloat = 70
    var titleCell: TitleCellScrollable?
    var maxFontSize: CGFloat { return 24 }

    func scrollPositionToShowNavBar () -> CGFloat {
        return titleCellHeight - statusBarHeigth
    }

    func didScrollInTable(_ scrollView: UIScrollView) {
        navBarFontSize = 18

        if let titleCell = titleCell {
            let fontSize = 18 - (scrollView.contentOffset.y + scrollPositionToShowNavBar()) / (CGFloat(64) - scrollPositionToShowNavBar()) * 4

            if fontSize < maxFontSize {
                titleCell.updateTitleFontSize(toSize: fontSize)
            } else {
                titleCell.updateTitleFontSize(toSize: maxFontSize)
            }

        }

        if self.shouldShowNavBar(scrollView) {
            showNavBar()
        } else {
            hideNavBar()
        }
    }

    override func getNavigationBarTitle() -> String {
        return ""
    }

    internal func shouldShowNavBar(_ scrollView: UIScrollView) -> Bool {
        return scrollView.contentOffset.y > -scrollPositionToShowNavBar()
    }

}

// TODO: Deprecate after PaymentVault & AditionalStep redesign/refactor.
internal protocol TitleCellScrollable {
    func updateTitleFontSize(toSize: CGFloat)
}
