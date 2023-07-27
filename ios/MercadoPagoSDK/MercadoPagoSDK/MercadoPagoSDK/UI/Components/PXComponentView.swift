//
//  PXComponentView.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 12/13/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

@objcMembers internal class PXComponentView: UIView {

    private var topGuideView = UIView()
    private var bottomGuideView = UIView()
    private var contentView = UIView()
    private lazy var carryMarginY: CGFloat = 0
    var heightConstraint: NSLayoutConstraint?
    var matchGuidesHeightContraint: NSLayoutConstraint?
    var topGuideZeroHeightContraint: NSLayoutConstraint?
    var bottomGuideZeroHeightContraint: NSLayoutConstraint?

    init() {
        super.init(frame: CGRect(x: 0, y: 0, width: 0, height: 0))
        initComponent()
    }

    func initComponent() {
        self.translatesAutoresizingMaskIntoConstraints = false
        topGuideView.translatesAutoresizingMaskIntoConstraints = false
        bottomGuideView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        super.addSubview(topGuideView)
        super.addSubview(bottomGuideView)
        super.addSubview(contentView)
        PXLayout.pinTop(view: topGuideView).isActive = true
        PXLayout.pinBottom(view: bottomGuideView).isActive = true

        matchGuidesHeightContraint = PXLayout.matchHeight(ofView: topGuideView, toView: bottomGuideView)
        matchGuidesHeightContraint?.isActive = true

        topGuideZeroHeightContraint = PXLayout.setHeight(owner: topGuideView, height: 0)
        topGuideZeroHeightContraint?.isActive = false

        bottomGuideZeroHeightContraint = PXLayout.setHeight(owner: bottomGuideView, height: 0)
        bottomGuideZeroHeightContraint?.isActive = false

        PXLayout.centerHorizontally(view: contentView).isActive = true
        PXLayout.centerHorizontally(view: topGuideView).isActive = true
        PXLayout.centerHorizontally(view: bottomGuideView).isActive = true
        PXLayout.put(view: contentView, onBottomOf: topGuideView).isActive = true
        PXLayout.put(view: contentView, aboveOf: bottomGuideView).isActive = true
        PXLayout.matchWidth(ofView: contentView).isActive = true
        PXLayout.matchWidth(ofView: topGuideView).isActive = true
        PXLayout.matchWidth(ofView: bottomGuideView).isActive = true
        carryMarginY = 0
    }

    public func pinContentViewToTop(margin: CGFloat = 0) {
        topGuideZeroHeightContraint?.isActive = true
        topGuideZeroHeightContraint?.constant = margin
        bottomGuideZeroHeightContraint?.isActive = false
        matchGuidesHeightContraint?.isActive = false
    }

    public func pinContentViewToBottom(margin: CGFloat = 0) {
        topGuideZeroHeightContraint?.isActive = false
        bottomGuideZeroHeightContraint?.isActive = true
        bottomGuideZeroHeightContraint?.constant = margin
        matchGuidesHeightContraint?.isActive = false
    }

    public func centerContentViewVertically() {
        topGuideZeroHeightContraint?.isActive = false
        bottomGuideZeroHeightContraint?.isActive = false
        matchGuidesHeightContraint?.isActive = true
    }

    public func removeMargins() {
        topGuideZeroHeightContraint?.isActive = true
        bottomGuideZeroHeightContraint?.isActive = true
        matchGuidesHeightContraint?.isActive = false
    }

    func fixHeight(height: CGFloat) {
        if let heightConstraint = self.heightConstraint {
            heightConstraint.constant = height
        } else {
            self.heightConstraint = PXLayout.setHeight(owner: self, height: height)
            self.heightConstraint?.isActive = true
        }
        self.layoutIfNeeded()
    }

    func prepareForRender() {
        for view in self.subviews {
            view.removeFromSuperview()
        }
        for constraint in self.constraints {
            constraint.isActive = false
        }
        initComponent()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func removeAllSubviews(except views: [UIView] = []) {
        for view in contentView.subviews {
            if !views.contains(view) {
                view.removeFromSuperview()
            }
        }
        carryMarginY = 0
    }

    override public func addSubview(_ view: UIView) {
        view.translatesAutoresizingMaskIntoConstraints = false
        self.contentView.addSubview(view)
    }

    override func bringSubviewToFront(_ view: UIView) {
        self.contentView.bringSubviewToFront(view)
    }

    override func sendSubviewToBack(_ view: UIView) {
        self.contentView.sendSubviewToBack(view)
    }

    func addSubviewToComponentView(_ view: UIView) {
        view.translatesAutoresizingMaskIntoConstraints = false
        super.addSubview(view)
    }

    public func addSubviewToBottom(_ view: UIView, withMargin margin: CGFloat = 0) {
        view.translatesAutoresizingMaskIntoConstraints = false
        self.contentView.addSubview(view)
        if self.contentView.subviews.count == 1 {
            PXLayout.pinTop(view: view, withMargin: margin).isActive = true
        } else {
            putOnBottomOfLastView(view: view, withMargin: margin)?.isActive = true
        }
        carryMarginY += margin
    }

    override func addSeparatorLineToTop(height: CGFloat, horizontalMarginPercentage: CGFloat, color: UIColor = .pxMediumLightGray) {
        self.topGuideView.addSeparatorLineToTop(height: height, horizontalMarginPercentage: horizontalMarginPercentage, color: color)
    }

    override func addSeparatorLineToBottom(height: CGFloat, horizontalMarginPercentage: CGFloat, color: UIColor = .pxMediumLightGray) {
        self.bottomGuideView.addSeparatorLineToBottom(height: height, horizontalMarginPercentage: horizontalMarginPercentage, color: color)
    }

    override func addLine(yCoordinate: CGFloat, height: CGFloat, horizontalMarginPercentage: CGFloat, color: UIColor) {
        super.addLine(yCoordinate: yCoordinate, height: height, horizontalMarginPercentage: horizontalMarginPercentage, color: color)
    }

    //Pin first content view subview to top
    @discardableResult
    public func pinFirstSubviewToTop(withMargin margin: CGFloat = 0 ) -> NSLayoutConstraint? {
        guard let firstView = self.contentView.subviews.first else {
            return nil
        }
        carryMarginY += margin
        return PXLayout.pinTop(view: firstView, to: self.contentView, withMargin: margin)
    }

    //Pin last content view subview to bottom
    @discardableResult
    public func pinLastSubviewToBottom(withMargin margin: CGFloat = 0 ) -> NSLayoutConstraint? {
        guard let lastView = self.contentView.subviews.last else {
            return nil
        }
        carryMarginY += margin
        return PXLayout.pinBottom(view: lastView, to: self.contentView, withMargin: margin)
    }

    //Put view on bottom of content view last subview
    @discardableResult
    public func putOnBottomOfLastView(view: UIView, withMargin margin: CGFloat = 0) -> NSLayoutConstraint? {
        if !self.contentView.subviews.contains(view) {
            return nil
        }
        carryMarginY += margin
        for actualView in self.contentView.subviews.reversed() where actualView != view {
            return PXLayout.put(view: view, onBottomOf: actualView, withMargin: margin)
        }
        return nil
    }

    func getSubviews() -> [UIView] {
        return self.contentView.subviews
    }

    func getCarryMarginY() -> CGFloat {
        return carryMarginY
    }

    func isEmpty() -> Bool {
        return self.contentView.subviews.count == 0
    }

    func getContentView() -> UIView {
        return contentView
    }

    func setBackground(color: UIColor?) {
        backgroundColor = color
        contentView.backgroundColor = color
        topGuideView.backgroundColor = color
        bottomGuideView.backgroundColor = color
    }
}

internal extension CALayer {
    func pxShadow(radius: CGFloat = 3, shadowOpacity: Float = 0.25) {
        self.shadowOffset = CGSize(width: 0, height: 0)
        self.shadowColor = UIColor.black.cgColor
        self.shadowRadius = radius
        self.shadowOpacity = shadowOpacity
    }
}
