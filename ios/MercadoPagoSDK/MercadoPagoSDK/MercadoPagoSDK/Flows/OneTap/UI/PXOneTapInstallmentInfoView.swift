//
//  PXOneTapInstallmentInfoView.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 15/10/18.
//

import UIKit

final class PXOneTapInstallmentInfoView: PXComponentView {
    static let DEFAULT_ROW_HEIGHT: CGFloat = 50
    static let HIGH_ROW_HEIGHT: CGFloat = 78
    private let titleLabel = UILabel()
    private let colapsedTag: Int = 2
    private var arrowImage: UIImageView = UIImageView()
    private var pagerView = FSPagerView(frame: .zero)
    private var tapEnabled = true

    weak var delegate: PXOneTapInstallmentInfoViewProtocol?
    private var model: [PXOneTapInstallmentInfoViewModel]?
}

// MARK: Privates
extension PXOneTapInstallmentInfoView {
    private func setupTitleLabel() {
        titleLabel.alpha = 0
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.text = "onetap_select_installment_title".localized
        titleLabel.textAlignment = .left
        titleLabel.font = Utils.getFont(size: PXLayout.XS_FONT)
        titleLabel.textColor = ThemeManager.shared.greyColor()
        addSubview(titleLabel)
        PXLayout.matchHeight(ofView: titleLabel).isActive = true
        PXLayout.centerVertically(view: titleLabel).isActive = true
        PXLayout.pinLeft(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
        PXLayout.pinRight(view: titleLabel, withMargin: PXLayout.L_MARGIN).isActive = true
    }

    private func setupSlider(width: CGFloat) {
        addSubview(pagerView)
        pagerView.isUserInteractionEnabled = false
        PXLayout.pinTop(view: pagerView).isActive = true
        PXLayout.pinBottom(view: pagerView).isActive = true
        PXLayout.pinLeft(view: pagerView).isActive = true
        PXLayout.pinRight(view: pagerView).isActive = true
        PXLayout.matchWidth(ofView: pagerView).isActive = true
        pagerView.dataSource = self
        pagerView.delegate = self
        pagerView.register(FSPagerViewCell.self, forCellWithReuseIdentifier: "cell")
        pagerView.isInfinite = false
        pagerView.automaticSlidingInterval = 0
        pagerView.bounces = true
        pagerView.interitemSpacing = PXCardSliderSizeManager.interItemSpace
        pagerView.decelerationDistance = 1
        pagerView.itemSize = CGSize(width: width, height: PXOneTapInstallmentInfoView.DEFAULT_ROW_HEIGHT)
    }
}

// MARK: DataSource
extension PXOneTapInstallmentInfoView: FSPagerViewDataSource {
    func numberOfItems(in pagerView: FSPagerView) -> Int {
        guard let model = model else { return 0 }
        return model.count
    }

    func pagerView(_ pagerView: FSPagerView, cellForItemAt index: Int) -> FSPagerViewCell {
        let cell = pagerView.dequeueReusableCell(withReuseIdentifier: "cell", at: index)

        guard let model = model else { return FSPagerViewCell() }

        let itemModel = model[index]
        cell.removeAllSubviews()

        var benefitsLabel: UILabel?
        if itemModel.shouldShowInstallmentsHeader, let benefitText = itemModel.benefits?.installmentsHeader?.getAttributedString(fontSize: PXLayout.XXXS_FONT) {
            let label = UILabel()
            benefitsLabel = label
            label.numberOfLines = 1
            label.translatesAutoresizingMaskIntoConstraints = false
            label.attributedText = benefitText
            label.textAlignment = .right
            cell.addSubview(label)
            PXLayout.pinRight(view: label, withMargin: PXLayout.M_MARGIN).isActive = true
            PXLayout.centerVertically(view: label).isActive = true
            PXLayout.matchHeight(ofView: label).isActive = true
        }

        let label = UILabel()
        label.numberOfLines = 1
        label.translatesAutoresizingMaskIntoConstraints = false
        label.attributedText = itemModel.text
        label.textAlignment = .left
        cell.addSubview(label)
        PXLayout.pinLeft(view: label, withMargin: PXLayout.XXXS_MARGIN).isActive = true
        PXLayout.centerVertically(view: label).isActive = true
        PXLayout.matchHeight(ofView: label).isActive = true

        if let benefitsLabel = benefitsLabel {
            PXLayout.put(view: label, leftOf: benefitsLabel, withMargin: PXLayout.XXXS_MARGIN).isActive = true
        } else {
            PXLayout.pinRight(view: label, withMargin: PXLayout.M_MARGIN).isActive = true
        }

        if !itemModel.status.enabled {
            let helperIcon = ResourceManager.shared.getImage("helper_ico_blue")
            let helperImageView = UIImageView(image: helperIcon)
            helperImageView.contentMode = .scaleAspectFit
            cell.addSubview(helperImageView)
            PXLayout.centerVertically(view: helperImageView).isActive = true
            PXLayout.setWidth(owner: helperImageView, width: 24).isActive = true
            PXLayout.setHeight(owner: helperImageView, height: 24).isActive = true
            PXLayout.pinRight(view: helperImageView, withMargin: PXLayout.ZERO_MARGIN).isActive = true
            PXLayout.put(view: helperImageView, rightOf: label, withMargin: PXLayout.XXXS_MARGIN, relation: .greaterThanOrEqual).isActive = true
        }

        return cell
    }
}

// MARK: Delegate
extension PXOneTapInstallmentInfoView: FSPagerViewDelegate {
    private func getCurrentIndex() -> Int? {
        if let mModel = model, mModel.count > 0 {
            let scrollOffset = pagerView.scrollOffset
            let floorOffset = floor(scrollOffset)
            return Int(floorOffset)
        } else {
            return nil
        }
    }

    func didEndDecelerating() {
        enableTap()
    }

    func pagerViewDidScroll(_ pagerView: FSPagerView) {
        disableTap()
        if let currentIndex = getCurrentIndex() {
            let newAlpha = 1 - (pagerView.scrollOffset - CGFloat(integerLiteral: currentIndex))
            if newAlpha < 0.5 {
                pagerView.alpha = 1 - newAlpha
            } else {
                pagerView.alpha = newAlpha
            }
        }
    }
}

// MARK: Publics
extension PXOneTapInstallmentInfoView {
    func update(model: [PXOneTapInstallmentInfoViewModel]?) {
        self.model = model
        pagerView.reloadData()
    }

    func isExpanded() -> Bool {
        return arrowImage.tag != colapsedTag
    }

    func getActiveRowIndex() -> Int {
        return pagerView.currentIndex
    }

    func disableTap() {
        tapEnabled = false
    }

    func enableTap() {
        tapEnabled = true
    }

    func render(_ width: CGFloat) {
        removeAllSubviews()
        setupSlider(width: width)
        setupFadeImages()
        setupChevron()
        setupTitleLabel()
        PXLayout.setHeight(owner: self, height: PXOneTapInstallmentInfoView.DEFAULT_ROW_HEIGHT).isActive = true
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(toggleInstallmentsWrapper)))
    }

    @objc
    func toggleInstallmentsWrapper() {
        toggleInstallments()
    }

    private func setupChevron() {
        addSubview(arrowImage)
        arrowImage.contentMode = UIView.ContentMode.scaleAspectFit
        arrowImage.image = ResourceManager.shared.getImage("one-tap-installments-info-chevron")
        PXLayout.centerVertically(view: arrowImage).isActive = true
        PXLayout.pinTop(view: arrowImage).isActive = true
        PXLayout.pinBottom(view: arrowImage).isActive = true
        PXLayout.setWidth(owner: arrowImage, width: 56).isActive = true
        PXLayout.pinRight(view: arrowImage, withMargin: 0).isActive = true
        arrowImage.tag = colapsedTag

        if let targetModel = model?.first, !targetModel.shouldShowArrow {
            disableTap()
            hideArrow()
        }
    }

    private func setupFadeImages() {
        let leftImage = ResourceManager.shared.getImage("one-tap-installments-info-left")
        let leftImageView = UIImageView(image: leftImage)
        leftImageView.translatesAutoresizingMaskIntoConstraints = false
        addSubview(leftImageView)
        PXLayout.pinTop(view: leftImageView).isActive = true
        PXLayout.pinBottom(view: leftImageView).isActive = true
        PXLayout.pinLeft(view: leftImageView).isActive = true
        PXLayout.setWidth(owner: leftImageView, width: 16).isActive = true

        let rightImage = ResourceManager.shared.getImage("one-tap-installments-info-right")
        let rightImageView = UIImageView(image: rightImage)
        rightImageView.translatesAutoresizingMaskIntoConstraints = false
        rightImageView.contentMode = .scaleAspectFill
        addSubview(rightImageView)
        PXLayout.pinTop(view: rightImageView).isActive = true
        PXLayout.pinBottom(view: rightImageView).isActive = true
        PXLayout.pinRight(view: rightImageView).isActive = true
        PXLayout.setWidth(owner: rightImageView, width: 30).isActive = true
    }

    func showArrow(duration: Double = 0.5) {
        animateArrow(alpha: 1, duration: duration)
    }

    func hideArrow(duration: Double = 0.5) {
        animateArrow(alpha: 0, duration: duration)
    }

    private func animateArrow(alpha: CGFloat, duration: Double) {
        var pxAnimator = PXAnimator(duration: duration, dampingRatio: 1)
        pxAnimator.addAnimation(animation: { [weak self] in
            self?.arrowImage.alpha = alpha
        })

        pxAnimator.animate()
    }

    func setSliderOffset(offset: CGPoint) {
        pagerView.scrollToOffset(offset, animated: false)
    }

    @objc func toggleInstallments(completion: ((Bool) -> Void)? = nil) {
        if let currentIndex = getCurrentIndex(), let currentModel = model, currentModel.indices.contains(currentIndex) {
            let cardStatus = currentModel[currentIndex].status
            if !cardStatus.enabled {
                delegate?.disabledCardTapped(status: cardStatus)
            } else if currentModel[currentIndex].shouldShowArrow, tapEnabled {
                let selectedModel = currentModel[currentIndex]
                if let installmentData = selectedModel.installmentData {
                    if arrowImage.tag != colapsedTag {
                        delegate?.hideInstallments()
                        UIView.animate(withDuration: 0.3, animations: { [weak self] in
                            self?.arrowImage.layer.transform = CATransform3DIdentity
                            self?.pagerView.alpha = 1
                            self?.titleLabel.alpha = 0
                        }, completion: completion)
                        arrowImage.tag = colapsedTag
                    } else {
                        delegate?.showInstallments(installmentData: installmentData, selectedPayerCost: selectedModel.selectedPayerCost, interest: selectedModel.benefits?.interestFree, reimbursement: selectedModel.benefits?.reimbursement)
                        UIView.animate(withDuration: 0.3, animations: { [weak self] in
                            let rotationAngle = (180.0 * CGFloat(Double.pi)) / 180.0
                            self?.arrowImage.layer.transform = CATransform3DRotate(CATransform3DIdentity, rotationAngle, 1.0, 0.0, 0.0)
                            self?.pagerView.alpha = 0
                            self?.titleLabel.alpha = 1
                        }, completion: completion)
                        arrowImage.tag = 1
                    }
                }
            }
        }
    }
}
