//
//  PaymentVaultViewController.swift
//  MercadoPagoSDK
//
//  Created by Maria cristina rodriguez on 15/1/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//

import UIKit

private func < <T: Comparable>(lhs: T?, rhs: T?) -> Bool {
  switch (lhs, rhs) {
  case let (l__?, r__?):
    return l__ < r__
  case (nil, _?):
    return true
  default:
    return false
  }
}

private func > <T: Comparable>(lhs: T?, rhs: T?) -> Bool {
  switch (lhs, rhs) {
  case let (l__?, r__?):
    return l__ > r__
  default:
    return rhs < lhs
  }
}

internal class PaymentVaultViewController: MercadoPagoUIScrollViewController, UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout {

    @IBOutlet weak var collectionSearch: UICollectionView!

    static let VIEW_CONTROLLER_NIB_NAME: String = "PaymentVaultViewController"

    var merchantBaseUrl: String!

    var groupName: String?

    var defaultInstallments: Int?
    var installments: Int?
    var viewModel: PaymentVaultViewModel!

    var bundle = ResourceManager.shared.getBundle()

    var titleSectionReference: PaymentVaultTitleCollectionViewCell?

    private var tintColor = true
    private var loadingGroups = true

    private let sectionInsets = UIEdgeInsets(top: 50.0, left: 20.0, bottom: 50.0, right: 20.0)

    private var defaultOptionSelected = false

    private var callback : ((_ paymentMethodSelected: PaymentMethodOption) -> Void)!

    private var floatingBottomRowView: UIView?

    init(viewModel: PaymentVaultViewModel, callback : @escaping (_ paymentMethodSelected: PaymentMethodOption) -> Void) {
        super.init(nibName: PaymentVaultViewController.VIEW_CONTROLLER_NIB_NAME, bundle: bundle)
        self.viewModel = viewModel
        if let groupName = self.viewModel.groupName {
            self.groupName = groupName
        }
        self.callback = callback
    }

    override open func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        trackScreen(path: viewModel.getScreenPath(), properties: viewModel.getScreenProperties())
    }

    required  public init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    open override func viewDidLoad() {
        super.viewDidLoad()

        NotificationCenter.default.addObserver(self, selector: #selector(self.updateCoupon(_:)), name: NSNotification.Name(rawValue: "MPSDK_UpdateCoupon"), object: nil)

        var upperFrame = self.collectionSearch.bounds
        upperFrame.origin.y = -upperFrame.size.height + 10
        upperFrame.size.width = UIScreen.main.bounds.width
        let upperView = UIView(frame: upperFrame)
        upperView.backgroundColor = UIColor.primaryColor()
        collectionSearch.addSubview(upperView)

        if self.title == nil || self.title!.isEmpty {
            self.title = "¿Cómo quieres pagar?".localized
        }

        self.registerAllCells()

        if callbackCancel == nil {
            self.callbackCancel = { [weak self] () -> Void in
                if let targetVC = self?.navigationController?.viewControllers[0], let currentVC = self, targetVC == currentVC {
                    self?.dismiss(animated: true, completion: {})
                } else {
                    self?.navigationController!.popViewController(animated: true)
                }
            }
        } else {
            self.callbackCancel = callbackCancel
        }

       self.collectionSearch.backgroundColor = UIColor.white
    }

    @objc func updateCoupon(_ notification: Notification) {
        if (notification.userInfo?["coupon"] as? PXDiscount) != nil {
            self.viewModel.amountHelper = PXAmountHelper(preference: viewModel.amountHelper.preference, paymentData: viewModel.amountHelper.getPaymentData(), chargeRules: viewModel.amountHelper.chargeRules, paymentConfigurationService: viewModel.amountHelper.paymentConfigurationService, splitAccountMoney: viewModel.amountHelper.splitAccountMoney)
            self.collectionSearch.reloadData()
        }
    }

    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        hideNavBar()
        navigationController!.navigationBar.shadowImage = nil
        extendedLayoutIncludesOpaqueBars = true

        collectionSearch.allowsSelection = true
        getCustomerCards()
        hideNavBarCallback = hideNavBarCallbackDisplayTitle()
        if loadingGroups {
            let temporalView = UIView(frame: CGRect(x: 0, y: navBarHeigth + statusBarHeigth, width: view.frame.size.width, height: view.frame.size.height))
            temporalView.backgroundColor?.withAlphaComponent(0)
            temporalView.isUserInteractionEnabled = false
            view.addSubview(temporalView)
        }
        renderFloatingBottomView()
        hideLoading()

        // This is a temporary fix until new PaymentVaultViewController screen.
        let deltaYOffset: CGFloat = 0.5
        collectionSearch.setContentOffset(CGPoint(x: 0, y: collectionSearch.contentOffset.y + deltaYOffset), animated: false)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        title = ""
    }

    func getCollectionViewPinBottomContraint() -> NSLayoutConstraint? {
        let filteredConstraints = self.view.constraints.filter { $0.identifier == "collection_view_pin_bottom" }
        if let bottomContraint = filteredConstraints.first {
            return bottomContraint
        }
        return nil
    }

    private func renderFloatingBottomView() {
        if viewModel.advancedConfiguration.amountRowEnabled {
            if floatingBottomRowView == nil {
                floatingBottomRowView = getFloatingTotalRowView()
                if let floatingRowView = floatingBottomRowView {
                    getCollectionViewPinBottomContraint()?.isActive = false
                    view.addSubview(floatingRowView)
                    PXLayout.matchWidth(ofView: floatingRowView).isActive = true
                    PXLayout.centerHorizontally(view: floatingRowView).isActive = true
                    PXLayout.pinBottom(view: floatingRowView, to: view).isActive = true
                    PXLayout.put(view: floatingRowView, onBottomOf: collectionSearch).isActive = true
                }
            }
        }
    }

    private func getFloatingTotalRowView() -> UIView {
        let component = PXTotalRowBuilder(amountHelper: self.viewModel.amountHelper, shouldShowChevron: PXTotalRowBuilder.shouldAddActionToRow(amountHelper: self.viewModel.amountHelper))
        let view = component.render()
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTotalRowTap))
        view.addGestureRecognizer(tap)
        return view
    }

    @objc func handleTotalRowTap() {
        PXTotalRowBuilder.handleTap(amountHelper: self.viewModel.amountHelper)
    }

    private func getCustomerCards() {
        self.loadPaymentMethodSearch()
    }

    fileprivate func hideNavBarCallbackDisplayTitle() -> (() -> Void) {
        return { [weak self] () -> Void in
            self?.titleSectionReference?.fillCell()
        }
    }

    fileprivate func loadPaymentMethodSearch() {
        self.collectionSearch.delegate = self
        self.collectionSearch.dataSource = self
        self.collectionSearch.reloadData()
        self.loadingGroups = false

        if self.viewModel.getDisplayedPaymentMethodsCount() == 1 {
            if let paymentOptionDefault = self.viewModel.getPaymentMethodOption(row: 0) as? PaymentMethodOption {
                self.callback(paymentOptionDefault)
            }
        }
    }

    private func registerAllCells() {
        let collectionSearchCell = UINib(nibName: "PaymentSearchCollectionViewCell", bundle: self.bundle)
        self.collectionSearch.register(collectionSearchCell, forCellWithReuseIdentifier: "searchCollectionCell")

        let paymentVaultTitleCollectionViewCell = UINib(nibName: "PaymentVaultTitleCollectionViewCell", bundle: self.bundle)
        self.collectionSearch.register(paymentVaultTitleCollectionViewCell, forCellWithReuseIdentifier: "paymentVaultTitleCollectionViewCell")
    }

    override func getNavigationBarTitle() -> String {
        if let cellRef = self.titleSectionReference {
            cellRef.title.text = ""
        }
        return "¿Cómo quieres pagar?".localized
    }

    open override func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {

        //En caso de que el vc no sea root
        if (navigationController != nil && navigationController!.viewControllers.count > 1 && navigationController!.viewControllers[0] != self) || (navigationController != nil && navigationController!.viewControllers.count == 1) {
            if self.viewModel!.isRoot {
                self.callbackCancel!()
            }
            return true
        }
        return false
    }

    public func numberOfSections(in collectionView: UICollectionView) -> Int {
        if self.loadingGroups {
            return 0
        }
        return 2
    }

    public func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        if isGroupSection(section: indexPath.section) {
            if let paymentItemDrawable = self.viewModel.getPaymentMethodOption(row: indexPath.row),
                let paymentSearchItemSelected = paymentItemDrawable as? PaymentMethodOption {
                collectionView.deselectItem(at: indexPath, animated: true)
                if paymentItemDrawable.isDisabled() {
                    let isAM = paymentSearchItemSelected.getId() == PXPaymentTypes.ACCOUNT_MONEY.rawValue
                    let vc = PXDisabledViewController(isAccountMoney: isAM)
                    PXComponentFactory.Modal.show(viewController: vc, title: nil)
                } else if let callback = self.callback {
                    collectionView.allowsSelection = false
                    callback(paymentSearchItemSelected)
                }
            }
        }
    }

    func isHeaderSection(section: Int) -> Bool {
        return section == 0
    }
    func isGroupSection(section: Int) -> Bool {
        let sectionGroup = 1

        return sectionGroup == section
    }

    public func collectionView(_ collectionView: UICollectionView,
                               numberOfItemsInSection section: Int) -> Int {
        if loadingGroups {
            return 0
        }
        if isHeaderSection(section: section) {
            return 1
        }

        return self.viewModel.getDisplayedPaymentMethodsCount()
    }

    public func collectionView(_ collectionView: UICollectionView,
                               cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {

        if indexPath.section == 0 {
            guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "paymentVaultTitleCollectionViewCell", for: indexPath) as? PaymentVaultTitleCollectionViewCell else { return UICollectionViewCell() }
            self.titleSectionReference = cell
            titleCell = cell
            return cell
        } else if isGroupSection(section: indexPath.section) {

            guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "searchCollectionCell", for: indexPath) as? PaymentSearchCollectionViewCell else { return UICollectionViewCell() }

            if let paymentMethodToDisplay = self.viewModel.getPaymentMethodOption(row: indexPath.row) {
                let discountInfo = self.viewModel.getDiscountInfo(row: indexPath.row)
                let creditsInfo = self.viewModel.getCreditsInfo(row: indexPath.row)
                cell.fillCell(drawablePaymentOption: paymentMethodToDisplay, discountInfo: discountInfo, creditsInfo: creditsInfo)
            }

            return cell

        }
        return UICollectionViewCell()

    }

    fileprivate let itemsPerRow: CGFloat = 2

    var sectionHeight: CGSize?

    override func scrollPositionToShowNavBar () -> CGFloat {
        return titleCellHeight - navBarHeigth - statusBarHeigth
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {

        let paddingSpace = CGFloat(32.0)
        let availableWidth = view.frame.width - paddingSpace

        titleCellHeight = 82
        if isHeaderSection(section: indexPath.section) {
            return CGSize(width: view.frame.width, height: titleCellHeight)
        }

        let widthPerItem = availableWidth / itemsPerRow
        return CGSize(width: widthPerItem, height: maxHegithRow(indexPath: indexPath))
    }

    private func maxHegithRow(indexPath: IndexPath) -> CGFloat {
        return self.calculateHeight(indexPath: indexPath, numberOfCells: self.viewModel.getDisplayedPaymentMethodsCount())
    }

    private func calculateHeight(indexPath: IndexPath, numberOfCells: Int) -> CGFloat {
        if numberOfCells == 0 {
            return 0
        }

        let section: Int
        let row = indexPath.row
        if row % 2 == 1 {
            section = (row - 1) / 2
        } else {
            section = row / 2
        }
        let index1 = (section * 2)
        let index2 = (section * 2) + 1

        if index1 + 1 > numberOfCells {
            return 0
        }

        let height1 = heightOfItem(indexItem: index1)

        if index2 + 1 > numberOfCells {
            return height1
        }

        let height2 = heightOfItem(indexItem: index2)

        return height1 > height2 ? height1 : height2
    }

    func heightOfItem(indexItem: Int) -> CGFloat {
        if let paymentMethodOptionDrawable = self.viewModel.getPaymentMethodOption(row: indexItem) {
            let discountInfo = self.viewModel.getDiscountInfo(row: indexItem)
            let creditsInfo = self.viewModel.getCreditsInfo(row: indexItem)
            return PaymentSearchCollectionViewCell.totalHeight(drawablePaymentOption: paymentMethodOptionDrawable, discountInfo: discountInfo, creditsInfo: creditsInfo)
        }
        return 0
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               insetForSectionAt section: Int) -> UIEdgeInsets {
        if isHeaderSection(section: section) {
            return UIEdgeInsets(top: 8, left: 8, bottom: 0, right: 8)
        }
        return UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)

    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 8
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        self.didScrollInTable(scrollView)
    }
 }
