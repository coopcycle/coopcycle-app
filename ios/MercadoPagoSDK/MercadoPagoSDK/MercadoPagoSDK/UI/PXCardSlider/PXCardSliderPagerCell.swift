//
//  PXCardSliderPagerCell.swift
//
//  Created by Juan sebastian Sanzone on 12/10/18.
//

import UIKit
import MLCardDrawer

class PXCardSliderPagerCell: FSPagerViewCell {
    static let identifier = "PXCardSliderPagerCell"
    static func getCell() -> UINib {
        return UINib(nibName: PXCardSliderPagerCell.identifier, bundle: ResourceManager.shared.getBundle())
    }

    private lazy var bottomMessageViewHeight: CGFloat = 24
    private lazy var cornerRadius: CGFloat = 11
    private var cardHeader: MLCardDrawerController?
    private weak var messageViewBottomConstraint: NSLayoutConstraint?
    private weak var messageLabelCenterConstraint: NSLayoutConstraint?
    private var consumerCreditCard: ConsumerCreditsCard?

    weak var delegate: PXTermsAndConditionViewDelegate?
    weak var addNewMethodDelegate: AddNewMethodCardDelegate?
    @IBOutlet weak var containerView: UIView!

    override func prepareForReuse() {
        super.prepareForReuse()
        cardHeader?.view.removeFromSuperview()
        containerView.removeAllSubviews()
        containerView.layer.masksToBounds = false
    }
}

protocol AddNewMethodCardDelegate: NSObjectProtocol {
    func addNewCard()
    func addNewOfflineMethod()
}

// MARK: Publics.
extension PXCardSliderPagerCell {
    func render(withCard: CardUI, cardData: CardData, isDisabled: Bool, cardSize: CGSize, bottomMessage: String? = nil) {
        containerView.layer.masksToBounds = false
        containerView.removeAllSubviews()
        containerView.layer.cornerRadius = cornerRadius
        containerView.backgroundColor = .clear
        cardHeader = MLCardDrawerController(withCard, cardData, isDisabled)
        cardHeader?.view.frame = CGRect(origin: CGPoint.zero, size: cardSize)
        cardHeader?.animated(false)
        cardHeader?.show()

        if let headerView = cardHeader?.view {
            containerView.addSubview(headerView)
            PXLayout.centerHorizontally(view: headerView).isActive = true
            PXLayout.centerVertically(view: headerView).isActive = true
        }
        addBottomMessageView(message: bottomMessage)
    }

    func renderEmptyCard(newCardData: PXAddNewMethodData?, newOfflineData: PXAddNewMethodData?, cardSize: CGSize, delegate: AddNewMethodCardDelegate) {
        self.addNewMethodDelegate = delegate

        containerView.backgroundColor = .clear
        containerView.layer.masksToBounds = true
        containerView.removeAllSubviews()
        containerView.layer.cornerRadius = cornerRadius

        let bigSize = cardSize.height
        let smallSize = (cardSize.height - PXLayout.XS_MARGIN) / 2

        let shouldApplyCompactMode = newCardData != nil && newOfflineData != nil
        let newMethodViewHeight = shouldApplyCompactMode ? smallSize : bigSize

        if let newCardData = newCardData {
            let icon = ResourceManager.shared.getImage("add_new_card")
            let newCardData = PXAddMethodData(title: newCardData.title, subtitle: newCardData.subtitle, icon: icon, compactMode: shouldApplyCompactMode)
            let newCardView = PXAddMethodView(data: newCardData)
            newCardView.translatesAutoresizingMaskIntoConstraints = false
            newCardView.layer.cornerRadius = cornerRadius
            containerView.addSubview(newCardView)

            let newCardTap = UITapGestureRecognizer(target: self, action: #selector(addNewCardTapped))
            newCardView.addGestureRecognizer(newCardTap)

            NSLayoutConstraint.activate([
                newCardView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
                newCardView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
                newCardView.topAnchor.constraint(equalTo: containerView.topAnchor),
                newCardView.heightAnchor.constraint(equalToConstant: newMethodViewHeight)
            ])
        }

        if let newOfflineData = newOfflineData {
            let icon = ResourceManager.shared.getImage("add_new_offline")
            let newOfflineData = PXAddMethodData(title: newOfflineData.title, subtitle: newOfflineData.subtitle, icon: icon, compactMode: shouldApplyCompactMode)
            let newOfflineView = PXAddMethodView(data: newOfflineData)
            newOfflineView.translatesAutoresizingMaskIntoConstraints = false
            newOfflineView.layer.cornerRadius = cornerRadius

            let newOfflineMethodTap = UITapGestureRecognizer(target: self, action: #selector(addNewOfflineMethodTapped))
            newOfflineView.addGestureRecognizer(newOfflineMethodTap)

            containerView.addSubview(newOfflineView)

            NSLayoutConstraint.activate([
                newOfflineView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
                newOfflineView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
                newOfflineView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
                newOfflineView.heightAnchor.constraint(equalToConstant: newMethodViewHeight)
            ])
        }
    }

    @objc
    func addNewCardTapped() {
        addNewMethodDelegate?.addNewCard()
    }

    @objc
    func addNewOfflineMethodTapped() {
        PXFeedbackGenerator.selectionFeedback()
        addNewMethodDelegate?.addNewOfflineMethod()
    }

    func renderAccountMoneyCard(isDisabled: Bool, cardSize: CGSize, bottomMessage: String? = nil) {
        containerView.layer.masksToBounds = false
        containerView.backgroundColor = .clear
        containerView.removeAllSubviews()
        containerView.layer.cornerRadius = cornerRadius
        cardHeader = MLCardDrawerController(AccountMoneyCard(), PXCardDataFactory(), isDisabled)
        cardHeader?.view.frame = CGRect(origin: CGPoint.zero, size: cardSize)
        cardHeader?.animated(false)
        cardHeader?.show()

        if let headerView = cardHeader?.view {
            containerView.addSubview(headerView)
            AccountMoneyCard.render(containerView: containerView, isDisabled: isDisabled, size: cardSize)
            PXLayout.centerHorizontally(view: headerView).isActive = true
            PXLayout.centerVertically(view: headerView).isActive = true
        }
        addBottomMessageView(message: bottomMessage)
    }

    func renderConsumerCreditsCard(creditsViewModel: PXCreditsViewModel, isDisabled: Bool, cardSize: CGSize, bottomMessage: String? = nil, creditsInstallmentSelected: Int? = nil) {
        consumerCreditCard = ConsumerCreditsCard(creditsViewModel, isDisabled: isDisabled)
        guard let consumerCreditCard = consumerCreditCard else { return }

        containerView.layer.masksToBounds = false
        containerView.backgroundColor = .clear
        containerView.removeAllSubviews()
        containerView.layer.cornerRadius = cornerRadius

        cardHeader = MLCardDrawerController(consumerCreditCard, PXCardDataFactory(), isDisabled)
        cardHeader?.view.frame = CGRect(origin: CGPoint.zero, size: cardSize)

        cardHeader?.animated(false)
        cardHeader?.show()

        if let headerView = cardHeader?.view {
            containerView.addSubview(headerView)
            consumerCreditCard.render(containerView: containerView, creditsViewModel: creditsViewModel, isDisabled: isDisabled, size: cardSize, selectedInstallments: creditsInstallmentSelected)
            consumerCreditCard.delegate = self
            PXLayout.centerHorizontally(view: headerView).isActive = true
            PXLayout.centerVertically(view: headerView).isActive = true
        }
        addBottomMessageView(message: bottomMessage)
    }

    func addBottomMessageView(message: String?) {
        guard let message = message else { return }

        let messageView = UIView()
        messageView.translatesAutoresizingMaskIntoConstraints = false
        messageView.backgroundColor = ThemeManager.shared.noTaxAndDiscountLabelTintColor()

        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = message
        label.numberOfLines = 1
        label.textAlignment = .center
        label.textColor = .white
        label.font = Utils.getSemiBoldFont(size: PXLayout.XXXS_FONT)

        messageView.addSubview(label)

        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: messageView.leadingAnchor),
            label.trailingAnchor.constraint(equalTo: messageView.trailingAnchor),
        ])

        messageLabelCenterConstraint = label.centerYAnchor.constraint(equalTo: messageView.centerYAnchor, constant: bottomMessageViewHeight)
        messageLabelCenterConstraint?.isActive = true

        containerView.clipsToBounds = true
        containerView.addSubview(messageView)

        NSLayoutConstraint.activate([
            messageView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            messageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            messageView.heightAnchor.constraint(equalToConstant: bottomMessageViewHeight),
        ])

        messageViewBottomConstraint = messageView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor, constant: bottomMessageViewHeight)
        messageViewBottomConstraint?.isActive = true
    }

    func flipToBack() {
        if !(cardHeader?.cardUI is AccountMoneyCard) {
            cardHeader?.showSecurityCode()
        }
    }

    func flipToFront() {
        cardHeader?.animated(true)
        cardHeader?.show()
        cardHeader?.animated(false)
    }

    func showBottomMessageView(_ shouldShow: Bool) {
        UIView.animate(withDuration: 0.5, animations: { [weak self] in
            guard let heightValue = self?.bottomMessageViewHeight else { return }
            self?.messageViewBottomConstraint?.constant = shouldShow ? 0 : heightValue
            self?.messageLabelCenterConstraint?.constant = shouldShow ? 0 : heightValue
            self?.layoutIfNeeded()
        })
    }
}

extension PXCardSliderPagerCell: PXTermsAndConditionViewDelegate {
    func shouldOpenTermsCondition(_ title: String, url: URL) {
        delegate?.shouldOpenTermsCondition(title, url: url)
    }
}

typealias PXAddMethodData = (title: PXText?, subtitle: PXText?, icon: UIImage?, compactMode: Bool)

class PXAddMethodView: UIView {
    //Icon sizes
    let COMPACT_ICON_SIZE: CGFloat = 48.0
    let DEFAULT_ICON_SIZE: CGFloat = 64.0

    let data: PXAddMethodData

    init(data: PXAddMethodData) {
        self.data = data
        super.init(frame: .zero)
        render()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func render() {
        self.removeAllSubviews()
        self.backgroundColor = .white

        let iconImageView = buildCircleImage(with: data.icon)
        addSubview(iconImageView)

        let labelsContainerView = UIStackView()
        labelsContainerView.translatesAutoresizingMaskIntoConstraints = false
        labelsContainerView.axis = .vertical

        if let title = data.title {
            let titleLabel = UILabel()
            titleLabel.numberOfLines = 1
            titleLabel.translatesAutoresizingMaskIntoConstraints = false
            titleLabel.attributedText = title.getAttributedString(fontSize: PXLayout.XS_FONT)
            titleLabel.textAlignment = data.compactMode ? .left : .center
            labelsContainerView.addArrangedSubview(titleLabel)
        }

        if let subtitle = data.subtitle {
            let subtitleLabel = UILabel()
            subtitleLabel.numberOfLines = 1
            subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
            subtitleLabel.attributedText = subtitle.getAttributedString(fontSize: PXLayout.XXS_FONT)
            subtitleLabel.textAlignment = data.compactMode ? .left : .center
            labelsContainerView.addArrangedSubview(subtitleLabel)
        }

        addSubview(labelsContainerView)

        if data.compactMode {
            let chevronImage = ResourceManager.shared.getImage("oneTapArrow_color")
            let chevronImageView = UIImageView(image: chevronImage)
            chevronImageView.translatesAutoresizingMaskIntoConstraints = false
            addSubview(chevronImageView)

            NSLayoutConstraint.activate([
                chevronImageView.centerYAnchor.constraint(equalTo: self.centerYAnchor),
                chevronImageView.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -PXLayout.M_MARGIN),
                chevronImageView.heightAnchor.constraint(equalToConstant: 13),
                chevronImageView.widthAnchor.constraint(equalToConstant: 8),
                iconImageView.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: PXLayout.S_MARGIN),
                iconImageView.centerYAnchor.constraint(equalTo: self.centerYAnchor),
                labelsContainerView.leadingAnchor.constraint(equalTo: iconImageView.trailingAnchor, constant: PXLayout.S_MARGIN),
                labelsContainerView.trailingAnchor.constraint(equalTo: chevronImageView.leadingAnchor, constant: -PXLayout.S_MARGIN),
                labelsContainerView.centerYAnchor.constraint(equalTo: self.centerYAnchor),
                labelsContainerView.heightAnchor.constraint(equalToConstant: 40)
            ])
        } else {
            NSLayoutConstraint.activate([
                iconImageView.topAnchor.constraint(equalTo: self.topAnchor, constant: PXLayout.XL_MARGIN),
                iconImageView.centerXAnchor.constraint(equalTo: self.centerXAnchor),
                labelsContainerView.topAnchor.constraint(equalTo: iconImageView.bottomAnchor, constant: PXLayout.S_MARGIN),
                labelsContainerView.leadingAnchor.constraint(equalTo: self.leadingAnchor, constant: PXLayout.S_MARGIN),
                labelsContainerView.trailingAnchor.constraint(equalTo: self.trailingAnchor, constant: -PXLayout.S_MARGIN),
                labelsContainerView.centerXAnchor.constraint(equalTo: self.centerXAnchor),
                labelsContainerView.heightAnchor.constraint(equalToConstant: 40)
            ])
        }
    }

    func buildCircleImage(with image: UIImage?) -> PXUIImageView {
        let iconSize = data.compactMode ? COMPACT_ICON_SIZE : DEFAULT_ICON_SIZE
        let circleImage = PXUIImageView(frame: CGRect(x: 0, y: 0, width: iconSize, height: iconSize))
        circleImage.layer.masksToBounds = false
        circleImage.layer.cornerRadius = circleImage.frame.height / 2
        circleImage.layer.borderWidth = 1
        circleImage.layer.borderColor = UIColor.black.withAlphaComponent(0.1).cgColor
        circleImage.clipsToBounds = true
        circleImage.translatesAutoresizingMaskIntoConstraints = false
        circleImage.enableFadeIn()
        circleImage.contentMode = .scaleAspectFit
        circleImage.image = image
        circleImage.backgroundColor = .clear
        PXLayout.setHeight(owner: circleImage, height: iconSize).isActive = true
        PXLayout.setWidth(owner: circleImage, width: iconSize).isActive = true
        return circleImage
    }
}
