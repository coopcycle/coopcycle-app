//
//  PXResultViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 20/10/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import UIKit

class PXResultViewController: PXComponentContainerViewController {

    let viewModel: PXResultViewModelInterface
    var headerView: PXHeaderView?
    var receiptView: UIView?
    var bodyContentView: UIView?
    var topCustomView: UIView?
    var bottomCustomView: UIView?
    var bodyView: UIView?
    var footerView: PXFooterView?

    internal var changePaymentMethodCallback: (() -> Void)?

    init(viewModel: PXResultViewModelInterface, callback : @escaping ( _ status: PaymentResult.CongratsState) -> Void) {
        self.viewModel = viewModel
        self.viewModel.setCallback(callback: callback)
        super.init(adjustInsets: false)
        self.scrollView.backgroundColor = viewModel.primaryResultColor()
        self.shouldHideNavigationBar = true
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        ViewUtils.addStatusBar(self.view, color: viewModel.primaryResultColor())
        self.scrollView.showsVerticalScrollIndicator = false
        self.scrollView.showsHorizontalScrollIndicator = false
        if contentView.getSubviews().isEmpty {
            renderViews()
            super.prepareForAnimation()
            super.animateContentView { (_) in
                self.headerView?.badgeImage?.animate(duration: 0.2)
            }
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if !String.isNullOrEmpty(viewModel.getTrackingPath()) {
            trackScreen(path: viewModel.getTrackingPath(), properties: viewModel.getTrackingProperties())
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationItem.backBarButtonItem = UIBarButtonItem(title: "", style: .plain, target: nil, action: nil)
    }

    func renderViews() {

        self.contentView.prepareForRender()

        //Add Header
        self.headerView = self.buildHeaderView()
        if let headerView = self.headerView {
            headerView.delegate = self
            headerView.pxShouldAnimated = false
            headerView.accessibilityIdentifier = "result_header_view"
            contentView.addSubview(headerView)
            PXLayout.pinTop(view: headerView, to: contentView).isActive = true
            PXLayout.matchWidth(ofView: headerView).isActive = true
        }

        //Add Receipt
        self.receiptView = self.buildReceiptView()
        if let receiptView = self.receiptView {
            contentView.addSubviewToBottom(receiptView)
            PXLayout.matchWidth(ofView: receiptView).isActive = true
            self.view.layoutIfNeeded()
            PXLayout.setHeight(owner: receiptView, height: receiptView.frame.height).isActive = true
        }

        //Add Body + Custom Components
        self.bodyContentView = buildBodyContentView()
        if let bodyContentView = self.bodyContentView {
            contentView.addSubviewToBottom(bodyContentView)
            PXLayout.matchWidth(ofView: bodyContentView).isActive = true
            PXLayout.centerHorizontally(view: bodyContentView).isActive = true
        }

        //Add Footer
        self.footerView = self.buildFooterView()
        if let footerView = self.footerView {
            footerView.delegate = self
            footerView.addSeparatorLineToTop(height: 1)
            contentView.addSubviewToBottom(footerView)
            PXLayout.matchWidth(ofView: footerView).isActive = true
            PXLayout.centerHorizontally(view: footerView, to: contentView).isActive = true
            self.view.layoutIfNeeded()
            PXLayout.setHeight(owner: footerView, height: footerView.frame.height).isActive = true
        }

        PXLayout.pinLastSubviewToBottom(view: contentView)?.isActive = true
        super.refreshContentViewSize()
        if isEmptySpaceOnScreen() {
            if shouldExpandHeader() {
                expandHeader()
            } else {
                expandBody()
            }
        }

        self.scrollView.contentSize = CGSize(width: self.scrollView.frame.width, height: self.contentView.frame.height)
        super.refreshContentViewSize()
    }

    func expandHeader() {
        self.view.layoutIfNeeded()
        self.scrollView.layoutIfNeeded()
        if let bodyContentView = self.bodyContentView {
            self.view.layoutIfNeeded()
            PXLayout.setHeight(owner: bodyContentView, height: bodyContentView.frame.height).isActive = true
        }
        let fixedHeight = totalContentViewHeigth() - self.contentView.frame.height
        guard let headerView = self.headerView else {
            return
        }
        PXLayout.setHeight(owner: headerView, height: headerView.frame.height + fixedHeight).isActive = true
        super.refreshContentViewSize()
    }

    func expandBody() {
        if let headerView = self.headerView {
            self.view.layoutIfNeeded()
            PXLayout.setHeight(owner: headerView, height: headerView.frame.height).isActive = true
        }
        let fixedHeight = totalContentViewHeigth() - self.contentView.frame.height
        guard let bodyContentView = self.bodyContentView else {
            return
        }
        PXLayout.setHeight(owner: bodyContentView, height: bodyContentView.frame.height + fixedHeight).isActive = true
        super.refreshContentViewSize()
    }

    func isEmptySpaceOnScreen() -> Bool {
        self.view.layoutIfNeeded()
        return self.contentView.frame.height < totalContentViewHeigth()
    }

    func shouldExpandHeader() -> Bool {
        self.view.layoutIfNeeded()
        guard let bodyContentView = self.bodyContentView else {
            return true
        }
        return bodyContentView.frame.height == 0
    }
}

// Components
extension PXResultViewController {
    func buildHeaderView() -> PXHeaderView? {
        let headerComponent = viewModel.buildHeaderComponent()
        if let headerView = headerComponent.render() as? PXHeaderView {
            return headerView
        }
        return nil
    }

    func buildFooterView() -> PXFooterView? {
        let footerComponent = viewModel.buildFooterComponent()
        if let footerView = footerComponent.render() as? PXFooterView {
            return footerView
        }
        return nil
    }

    func buildReceiptView() -> UIView? {
        let receiptComponent = viewModel.buildReceiptComponent()
        if let receiptView = receiptComponent?.render() {
            if receiptView.backgroundColor == nil {
                receiptView.backgroundColor = .white
            }
            return receiptView
        }
        return nil
    }

    func buildBodyContentView() -> UIView? {
        let view = PXComponentView()
        view.translatesAutoresizingMaskIntoConstraints = false

        if let topCustomView = buildTopCustomView() {
            self.topCustomView = topCustomView
            topCustomView.clipsToBounds = true
            view.addSubviewToBottom(topCustomView)
            PXLayout.matchWidth(ofView: topCustomView).isActive = true
            PXLayout.centerHorizontally(view: topCustomView).isActive = true
            topCustomView.layoutIfNeeded()
        }

        if let bodyView = buildBodyView() {
            self.bodyView = bodyView
            view.addSubviewToBottom(bodyView)
            PXLayout.matchWidth(ofView: bodyView).isActive = true
            PXLayout.centerHorizontally(view: bodyView).isActive = true
            bodyView.layoutIfNeeded()
        }

        if let bottomCustomView = buildBottomCustomView() {
            self.bottomCustomView = bottomCustomView
            bottomCustomView.clipsToBounds = true
            view.addSubviewToBottom(bottomCustomView)
            PXLayout.matchWidth(ofView: bottomCustomView).isActive = true
            PXLayout.centerHorizontally(view: bottomCustomView).isActive = true
            bottomCustomView.layoutIfNeeded()
        }

        view.pinLastSubviewToBottom()?.isActive = true
        view.layoutIfNeeded()
        self.view.layoutIfNeeded()

        if view.getContentView().subviews.isEmpty {
            return nil
        }
        return view
    }

    func buildBodyView() -> UIView? {
        let bodyComponent = viewModel.buildBodyComponent()
        return bodyComponent?.render()
    }

    func buildTopCustomView() -> UIView? {
        if let customView = self.viewModel.buildTopCustomView() {
            if customView.backgroundColor == nil {
                customView.backgroundColor = .white
            }
            return customView
        }
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }

    func buildBottomCustomView() -> UIView? {
        if let customView = self.viewModel.buildBottomCustomView() {
            if customView.backgroundColor == nil {
                customView.backgroundColor = .white
            }
            return customView
        }
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }
}
