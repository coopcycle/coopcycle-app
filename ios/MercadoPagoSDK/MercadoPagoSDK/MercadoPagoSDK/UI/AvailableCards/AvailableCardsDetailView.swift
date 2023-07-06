//
//  AvailableCardsDetailView.swift
//  Pods
//
//  Created by Angie Arlanti on 8/28/17.
//
//

import UIKit

class AvailableCardsDetailView: UIView {

    static let HEADER_HEIGHT: CGFloat = 105.0
    static let ITEMS_HEIGHT: CGFloat = 40.0
    static let HEADER_SCROLL_HEIGHT: CGFloat = 20.0
    var scrollCards: UIScrollView!
    var titleLable: UILabel!
    var subtitleLable: UILabel!
    let margin: CGFloat = 5.0
    let titleFontSize: CGFloat = 20
    let baselineOffSet: Int = 6

    var paymentMethods: [PXPaymentMethod]!

    init(frame: CGRect, paymentMethods: [PXPaymentMethod]) {
        super.init(frame: frame)
        self.paymentMethods = paymentMethods

        self.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)

        setScrollView()

        setTitles()

    }

    func setScrollView() {
        scrollCards = UIScrollView()
        scrollCards.isUserInteractionEnabled = true
        scrollCards.frame = getScrollCardsFrame()
        scrollCards.contentSize = getScrollCardsContentSize()

        scrollCards.addSubview(getHeaderView())

        var yPos: CGFloat = AvailableCardsDetailView.HEADER_SCROLL_HEIGHT

        for paymentMethod in paymentMethods {
            scrollCards.addSubview(getCardAvailableView(posY: yPos, paymentMethod: paymentMethod))
            yPos += AvailableCardsDetailView.ITEMS_HEIGHT
        }

        self.addSubview(scrollCards)
    }

    func setTitles() {
        titleLable = MPCardFormToolbarLabel()
        titleLable.frame = getTitleLabelFrame()
        titleLable.textColor = ThemeManager.shared.boldLabelTintColor()
        titleLable.text = "No te preocupes, aún puedes terminar tu pago con:".localized
        titleLable.font = Utils.getFont(size: 22.0)
        titleLable.numberOfLines = 2
        titleLable.textAlignment = .center
        titleLable.adjustsFontSizeToFitWidth = true
        self.addSubview(titleLable)

    }

    func getScrollCardsFrame() -> CGRect {
        return CGRect(x: 0, y: AvailableCardsDetailView.HEADER_HEIGHT, width: self.frame.size.width, height: self.frame.size.height - AvailableCardsDetailView.HEADER_HEIGHT)
    }

    func getScrollCardsContentSize() -> CGSize {
        return CGSize(width: self.frame.size.width, height: AvailableCardsDetailView.ITEMS_HEIGHT * CGFloat(paymentMethods.count) + AvailableCardsDetailView.HEADER_SCROLL_HEIGHT)
    }

    func getHeaderView() -> UIView {
        let headerView = UIView(frame: CGRect(x: 0, y: 0, width: self.frame.size.width, height: AvailableCardsDetailView.HEADER_SCROLL_HEIGHT))
        headerView.backgroundColor = .white
        return headerView
    }

    func getCardAvailableView(posY: CGFloat, paymentMethod: PXPaymentMethod) -> CardAvailableView {
        return CardAvailableView(frame: CGRect(x: 0, y: posY, width: self.frame.size.width, height: AvailableCardsDetailView.ITEMS_HEIGHT), paymentMethod: paymentMethod)
    }

    func getTitleLabelFrame() -> CGRect {
        let width = self.frame.size.width - (2 * margin)
        return CGRect(x: 0, y: margin, width: width, height: AvailableCardsDetailView.HEADER_HEIGHT)
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

}
