'use client'

import { Button, Modal, toast, useFormFields, useModal } from '@payloadcms/ui'
import React, { useCallback, useRef } from 'react'
import './CampaignTestButton.scss'
const baseClass = 'campaign-test'

const CampaignTestButton = () => {
	const { openModal, closeModal, setBodyScrollLock } = useModal()
	const modalRef = useRef<HTMLDivElement>(null)
	const template = useFormFields(([fields]) => fields.template.value)
	const [testEmail, setTestEmail] = React.useState('')
	const [isLoading, setIsLoading] = React.useState(false)

	const handleOpenModal = () => {
		openModal('preview-campaign')
		if (modalRef.current) {
			setBodyScrollLock(true, modalRef.current)
		}
	}

	const handleClose = useCallback(() => {
		closeModal('preview-campaign')
		if (modalRef.current) {
			setBodyScrollLock(false, modalRef.current)
		}
		setTestEmail('')
	}, [closeModal, setBodyScrollLock])

	const handleOverlayClick = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (e.target === e.currentTarget) {
				handleClose()
			}
		},
		[handleClose]
	)

	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const handleSendTestEmail = useCallback(async () => {
		if (!testEmail) {
			toast.error('Please enter an email address')
			return
		}

		if (!validateEmail(testEmail)) {
			toast.error('Please enter a valid email address')
			return
		}

		if (!template) {
			toast.error('No template selected')
			return
		}

		setIsLoading(true)
		try {
			const res = await fetch('/api/marketing-campaigns/preview-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					emailTo: testEmail,
					templateId: template,
				}),
			})

			if (!res.ok) {
				const error = await res.json()
				throw new Error(error.message || 'Failed to send test email')
			}

			toast.success('Test email sent successfully')
			handleClose()
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to send test email')
		} finally {
			setIsLoading(false)
		}
	}, [template, testEmail, handleClose])

	return (
		<>
			<Button buttonStyle="secondary" onClick={handleOpenModal}>
				Send Test Email
			</Button>
			<Modal
				slug="preview-campaign"
				className={baseClass}
				onClick={handleOverlayClick}
				onTouchEnd={handleOverlayClick}
			>
				<div className={`${baseClass}__wrapper`} ref={modalRef}>
					<h3>Send Test Email</h3>
					<div className="field-type">
						<label className="field-label">Email to</label>
						<input
							type="email"
							className={`${baseClass}__input`}
							value={testEmail}
							onChange={(e) => setTestEmail(e.target.value)}
							placeholder="Enter email address"
							required
						/>
					</div>

					<div className={`${baseClass}__actions`}>
						<Button
							className={`${baseClass}__btn`}
							onClick={handleSendTestEmail}
							disabled={isLoading}
						>
							{isLoading ? 'Sending...' : 'Send Now'}
						</Button>
						<Button
							className={`${baseClass}__btn`}
							buttonStyle="secondary"
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default CampaignTestButton
