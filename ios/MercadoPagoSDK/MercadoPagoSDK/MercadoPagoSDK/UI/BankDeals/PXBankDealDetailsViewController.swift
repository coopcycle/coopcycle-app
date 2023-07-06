//
//  PXBankDealDetailsViewController.swift
//  MercadoPagoSDK
//
//  Created by AUGUSTO COLLERONE ALFONSO on 24/4/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import UIKit

class PXBankDealDetailsViewController: PXComponentContainerViewController {

    fileprivate let CELL_CONTENT_HEIGHT: CGFloat = 128
    fileprivate let CELL_HEIGHT: CGFloat = 190
    fileprivate let HIGHLIGHTED_BACKGROUND_COLOR = ThemeManager.shared.lightTintColor()

    fileprivate var viewModel: PXBankDealDetailsViewModel!

    init(viewModel: PXBankDealDetailsViewModel) {
        self.viewModel = viewModel
        super.init()
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupUI()
        self.scrollView.showsVerticalScrollIndicator = false
        self.scrollView.showsHorizontalScrollIndicator = false
        self.view.layoutIfNeeded()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackScreen()
    }
}

// MARK: UI Methods
extension PXBankDealDetailsViewController {

    fileprivate func setupUI() {
        self.title = "bank_deal_details_title".localized
        self.contentView.backgroundColor = HIGHLIGHTED_BACKGROUND_COLOR
        self.scrollView.backgroundColor = HIGHLIGHTED_BACKGROUND_COLOR
        if contentView.getSubviews().isEmpty {
            renderViews()
        }
    }

    fileprivate func renderViews() {
        self.contentView.prepareForRender()
        self.view.isUserInteractionEnabled = true

        //Bank Deal Component
        let cellContainer = PXComponentView()
        let bankDealComponentView = buildBankDealComponentView()
        cellContainer.backgroundColor = bankDealComponentView.backgroundColor
        cellContainer.addSubview(bankDealComponentView)
        PXLayout.setHeight(owner: bankDealComponentView, height: CELL_CONTENT_HEIGHT).isActive = true
        PXLayout.matchWidth(ofView: bankDealComponentView, withPercentage: 60).isActive = true
        PXLayout.centerHorizontally(view: bankDealComponentView).isActive = true
        PXLayout.centerVertically(view: bankDealComponentView).isActive = true
        self.contentView.addSubviewToBottom(cellContainer)
        PXLayout.matchWidth(ofView: cellContainer).isActive = true
        PXLayout.centerHorizontally(view: cellContainer).isActive = true
        PXLayout.setHeight(owner: cellContainer, height: CELL_HEIGHT).isActive = true

        //Legals
        if let legalsText = self.viewModel.getLegalsText() {
            let legalsTextView = buildLegalTextView(text: legalsText)
            self.contentView.addSubview(legalsTextView)
            PXLayout.put(view: legalsTextView, onBottomOf: cellContainer).isActive = true
            PXLayout.matchWidth(ofView: legalsTextView).isActive = true
            PXLayout.centerHorizontally(view: legalsTextView).isActive = true
            PXLayout.pinBottom(view: legalsTextView).isActive = true
        }

        self.contentView.layoutIfNeeded()
        super.refreshContentViewSize()
    }
}

// MARK: Component Builders
extension PXBankDealDetailsViewController {
    fileprivate func buildBankDealComponentView() -> UIView {
        let component = self.viewModel.getBankDealComponent()
        let view = component.render()
        return view
    }

    fileprivate func buildLegalTextView(text: String) -> UIView {
        let legalsTextView = UITextView()
        legalsTextView.translatesAutoresizingMaskIntoConstraints = false
        legalsTextView.text = text
        legalsTextView.font = Utils.getFont(size: PXLayout.XXXS_FONT)
        legalsTextView.textContainerInset = UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16)
        legalsTextView.textColor = ThemeManager.shared.labelTintColor()
        legalsTextView.backgroundColor = .clear
        legalsTextView.isScrollEnabled = false
        legalsTextView.isEditable = false
        return legalsTextView
    }
}

// MARK: Tracking
internal extension PXBankDealDetailsViewController {
    func trackScreen() {
        trackScreen(path: TrackingPaths.Screens.getTermsAndConditionBankDealsPath())
    }
}
