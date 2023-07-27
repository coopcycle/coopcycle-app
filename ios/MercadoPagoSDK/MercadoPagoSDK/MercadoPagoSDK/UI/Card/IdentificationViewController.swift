//
//  IdentificationViewController.swift
//  MercadoPagoSDK
//
//  Created by Demian Tejo on 5/3/16.
//  Copyright © 2016 MercadoPago. All rights reserved.
//
import UIKit

internal class IdentificationViewController: MercadoPagoUIViewController, UITextFieldDelegate, UIPickerViewDataSource, UIPickerViewDelegate {

    @IBOutlet weak var textField: HoshiTextField!
    @IBOutlet var typePicker: UIPickerView! = UIPickerView()
    @IBOutlet weak var numberTextField: HoshiTextField!
    @IBOutlet weak var keyboardHeightConstraint: NSLayoutConstraint!
    var numberDocLabel: UILabel!
    var tipoDeDocumentoLabel: UILabel!
    var callback : (( PXIdentification) -> Void)?
    var errorExitCallback: (() -> Void)?
    var identificationTypes: [PXIdentificationType]!
    var identificationType: PXIdentificationType? {
        didSet {
            self.updateKeyboard()
        }
    }

    //identification Masks
    var identificationMask = TextMaskFormater(mask: "XXXXXXXXXXXXX", completeEmptySpaces: false, leftToRight: false)
    var defaultEditTextMask = TextMaskFormater(mask: "XXXXXXXXXXXXXXXXXXXX", completeEmptySpaces: false, leftToRight: false)

    var toolbar: PXToolbar?
    var identificationView: UIView!
    var identificationCard: IdentificationCardView?
    var paymentMethod: PXPaymentMethod?

    var navItem: UINavigationItem?
    var doneNext: UIBarButtonItem?
    var donePrev: UIBarButtonItem?

    var errorLabel: MPLabel?

    public init(identificationTypes: [PXIdentificationType], paymentMethod: PXPaymentMethod?, callback : @escaping (( _ identification: PXIdentification) -> Void), errorExitCallback: (() -> Void)?) {
        self.paymentMethod = paymentMethod
        super.init(nibName: "IdentificationViewController", bundle: ResourceManager.shared.getBundle())
        self.callback = callback
        self.identificationTypes = identificationTypes
        self.errorExitCallback = errorExitCallback
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override open func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow), name: UIResponder.keyboardWillShowNotification, object: nil)
        identificationCard = IdentificationCardView()

        self.identificationView = UIView()

        let IDcardHeight = getCardHeight()
        let IDcardWidht = getCardWidth()
        let xMargin = (UIScreen.main.bounds.size.width - IDcardWidht) / 2
        let yMargin = (UIScreen.main.bounds.size.height - 384 - IDcardHeight ) / 2

        let rectBackground = CGRect(x: xMargin, y: yMargin, width: IDcardWidht, height: IDcardHeight)
        let rect = CGRect(x: 0, y: 0, width: IDcardWidht, height: IDcardHeight)
        self.identificationView.frame = rectBackground
        identificationCard?.frame = rect
        self.identificationView.backgroundColor = UIColor(netHex: 0xEEEEEE)
        self.identificationView.layer.cornerRadius = 11
        self.identificationView.layer.masksToBounds = true
        self.view.addSubview(identificationView)
        identificationView.addSubview(identificationCard!)

        tipoDeDocumentoLabel = identificationCard?.tipoDeDocumentoLabel
        numberDocLabel = identificationCard?.numberDocLabel

        self.tipoDeDocumentoLabel.text =  "DOCUMENTO DEL TITULAR DE LA TARJETA".localized
        self.tipoDeDocumentoLabel.font = Utils.getIdentificationFont(size: 10)
        self.numberTextField.placeholder = "Número".localized
        self.numberTextField.borderActiveColor = ThemeManager.shared.secondaryColor()
        self.numberTextField.borderInactiveColor = ThemeManager.shared.secondaryColor()
        self.textField.placeholder = "Tipo".localized
        self.textField.borderActiveColor = ThemeManager.shared.secondaryColor()
        self.textField.borderInactiveColor = ThemeManager.shared.secondaryColor()
        self.view.backgroundColor = ThemeManager.shared.getMainColor()
        numberTextField.autocorrectionType = UITextAutocorrectionType.no
        numberTextField.keyboardAppearance = .light
        numberTextField.addTarget(self, action: #selector(IdentificationViewController.editingChanged(_:)), for: UIControl.Event.editingChanged)
        self.setupInputAccessoryView()
        identificationType = self.identificationTypes.first
        textField.text = self.identificationTypes.first?.name
        self.numberTextField.text = ""
        self.remask()
    }

    open override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.numberTextField.becomeFirstResponder()
        if let paymentMethod = paymentMethod {
            var properties: [String: Any] = [:]
            properties["payment_method_id"] = paymentMethod.id
            trackScreen(path: TrackingPaths.Screens.CardForm.getIdentificationPath(paymentTypeId: paymentMethod.paymentTypeId), properties: properties, treatBackAsAbort: true)
        }
    }

    override func loadMPStyles() {
        var titleDict: [NSAttributedString.Key: Any] = [:]
        if self.navigationController != nil {
            let font = Utils.getFont(size: 18)
            titleDict = [NSAttributedString.Key.foregroundColor: ThemeManager.shared.navigationBar().tintColor, NSAttributedString.Key.font: font]
            if self.navigationController != nil {
                self.navigationController!.navigationBar.titleTextAttributes = titleDict
                self.navigationItem.hidesBackButton = true
                self.navigationController?.navigationBar.tintColor = UIColor.white
                self.navigationController?.navigationBar.barTintColor = ThemeManager.shared.getMainColor()
                self.navigationController?.navigationBar.removeBottomLine()
                self.navigationController?.navigationBar.isTranslucent = false
                displayBackButton()
            }
        }
        let pickerView = UIPickerView(frame: CGRect(x: 0, y: 150, width: view.frame.width, height: 216))
        pickerView.backgroundColor = UIColor.white
        pickerView.showsSelectionIndicator = true
        pickerView.backgroundColor = UIColor.white
        pickerView.showsSelectionIndicator = true
        pickerView.dataSource = self
        pickerView.delegate = self
        let toolBar = PXToolbar()
        toolBar.barStyle = UIBarStyle.default
        toolBar.sizeToFit()

        let doneButton = UIBarButtonItem(title: "OK".localized, style: .plain, target: self, action: #selector(IdentificationViewController.donePicker))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonItem.SystemItem.flexibleSpace, target: nil, action: nil)

        let font = Utils.getFont(size: 14)
        doneButton.setTitleTextAttributes([NSAttributedString.Key.font: font], for: UIControl.State())

        toolBar.setItems([spaceButton, doneButton], animated: false)
        toolBar.isUserInteractionEnabled = true

        textField.inputView = pickerView
        textField.inputAccessoryView = toolBar
    }

    open func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        let backspace: String = ""

        guard let identificationType = identificationType else {
            return false
        }
        if identificationType.isNumberType(), !string.isNumber {
            return false
        }
        if textField.text?.count == identificationType.maxLength {
            return string == backspace
        }
        return true
    }

    public func textFieldDidEndEditing(_ textField: UITextField) {
        self.remask()
    }

    open func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        self.numberDocLabel.resignFirstResponder()
        return true
    }

    @objc open func editingChanged(_ textField: UITextField) {
        hideErrorMessage()
        self.remask()
        textField.text = defaultEditTextMask.textMasked(textField.text, remasked: true)
    }

    @objc open func donePicker() {
        textField.resignFirstResponder()
        numberTextField.becomeFirstResponder()
    }

    @objc func keyboardWillShow(notification: Notification) {
        if let keyboardSize = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue {
            self.keyboardHeightConstraint.constant = keyboardSize.height + 61 // Keyboard + Vista, dejo el mismo nombre de variable para tener consistencia entre clases, pero esta constante no representa la altura real del teclado, sino una altura que varia dependiendo de la altura del teclado
            self.view.layoutIfNeeded()
            self.view.setNeedsUpdateConstraints()
        }
    }

    func getCardWidth() -> CGFloat {
        let widthTotal = UIScreen.main.bounds.size.width * 0.70
        if widthTotal < 512 {
            if (0.63 * widthTotal) < (UIScreen.main.bounds.size.height - 394) {
                return widthTotal
            } else {
                return (UIScreen.main.bounds.size.height - 394) / 0.63
            }

        } else {
            return 512
        }

    }

    func getCardHeight() -> CGFloat {
        return ( getCardWidth() * 0.63 )
    }

    open func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        if self.identificationTypes == nil {
            return 0
        }

        return self.identificationTypes.count
    }

    open func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return self.identificationTypes[row].name
    }

    open func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        identificationType = self.identificationTypes[row]
        textField.text = self.identificationTypes[row].name
        self.numberTextField.text = ""
        self.remask()

    }

    @IBAction func setType(_ sender: AnyObject) {
        numberTextField.resignFirstResponder()
    }

    func setupInputAccessoryView() {

        if self.toolbar == nil {
            let frame = CGRect(x: 0, y: 0, width: UIScreen.main.bounds.size.width, height: 44)

            let toolbar = PXToolbar(frame: frame)

            toolbar.barStyle = UIBarStyle.default
            toolbar.isUserInteractionEnabled = true

            let buttonNext = UIBarButtonItem(title: "Continuar".localized, style: .plain, target: self, action: #selector(IdentificationViewController.rightArrowKeyTapped))
            let buttonPrev = UIBarButtonItem(title: "card_form_previous_button".localized, style: .plain, target: self, action: #selector(IdentificationViewController.leftArrowKeyTapped))

            let flexibleSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)

            toolbar.items = [buttonPrev, flexibleSpace, buttonNext]

            numberTextField.delegate = self
            self.toolbar = toolbar
        }
        numberTextField.inputAccessoryView = self.toolbar
    }

    @objc func rightArrowKeyTapped() {
        let idnt = PXIdentification(number: defaultEditTextMask.textUnmasked(numberTextField.text), type: self.identificationType?.id)

        let cardToken = PXCardToken(cardNumber: "", expirationMonth: 10, expirationYear: 10, securityCode: "", cardholderName: "", docType: (self.identificationType?.type)!, docNumber: defaultEditTextMask.textUnmasked(numberTextField.text), requireESC: false)

        if (cardToken.validateIdentificationNumber(self.identificationType)) == nil {
            self.numberTextField.resignFirstResponder()
            self.callback!(idnt)
        } else {
            showErrorMessage((cardToken.validateIdentificationNumber(self.identificationType))!)
        }

    }

    func showErrorMessage(_ errorMessage: String) {

        guard let toolbar = toolbar else {
            return
        }

        errorLabel = MPLabel(frame: toolbar.frame)
        self.errorLabel!.backgroundColor = UIColor.UIColorFromRGB(0xEEEEEE)
        self.errorLabel!.textColor = ThemeManager.shared.rejectedColor()
        self.errorLabel!.text = errorMessage
        self.errorLabel!.textAlignment = .center
        self.errorLabel!.font = self.errorLabel!.font.withSize(12)
        numberTextField.borderInactiveColor = ThemeManager.shared.rejectedColor()
        numberTextField.borderActiveColor = ThemeManager.shared.rejectedColor()
        numberTextField.inputAccessoryView = errorLabel
        numberTextField.setNeedsDisplay()
        numberTextField.resignFirstResponder()
        numberTextField.becomeFirstResponder()
        trackError(errorMessage: errorMessage)
    }

    func hideErrorMessage() {
        self.numberTextField.borderInactiveColor = ThemeManager.shared.secondaryColor()
        self.numberTextField.borderActiveColor = ThemeManager.shared.secondaryColor()
        self.numberTextField.inputAccessoryView = self.toolbar
        self.numberTextField.setNeedsDisplay()
        self.numberTextField.resignFirstResponder()
        self.numberTextField.becomeFirstResponder()
    }

    @objc func leftArrowKeyTapped() {
        trackBackEvent()
        self.navigationController?.popViewController(animated: false)
    }

    private func drawMask(masks: [TextMaskFormater]) {

        let charactersCount = numberTextField.text?.count

        if charactersCount! >= 1 {
            let identificationMask = masks[1]
            numberTextField.text = defaultEditTextMask.textMasked(numberTextField.text, remasked: true)
            self.numberDocLabel.text = identificationMask.textMasked(defaultEditTextMask.textUnmasked(numberTextField.text))

        } else {
            let identificationMask = masks[0]
            numberTextField.text = defaultEditTextMask.textMasked(numberTextField.text, remasked: true)
            self.numberDocLabel.text = identificationMask.textMasked(defaultEditTextMask.textUnmasked(numberTextField.text))
        }
    }

    private func remask() {
        drawMask(masks: Utils.getMasks(forId: identificationType))
    }
}

// MARK: Identification type keyboard fix
extension IdentificationViewController {
    private func updateKeyboard() {
        guard let identificationType = identificationType else {
            numberTextField.keyboardType = .default
            return
        }
        numberTextField.keyboardType = identificationType.isNumberType() ? .numberPad : .numbersAndPunctuation
    }
}
