import { motion } from "framer-motion";
import { ArrowRight, Shield, Shuffle, Send } from "lucide-react";

export const PrivacyFlow = () => {
	const steps = [
		{
			icon: Shield,
			title: "Router Contract",
			description: "Deposit funds on Arbitrum One",
			color: "text-primary",
		},
		{
			icon: Shuffle,
			title: "L3 Anonymization",
			description: "Burner wallet creation",
			color: "text-accent",
		},
		{
			icon: Send,
			title: "Distribution",
			description: "Anonymous delivery to recipients",
			color: "text-primary",
		},
	];

	return (
		<div className="w-full max-w-4xl mx-auto">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="glass p-8 rounded-2xl"
			>
				<h3 className="text-2xl font-display font-semibold mb-8 text-center">
					How It Works
				</h3>

				<div className="flex items-center justify-between gap-4">
					{steps.map((step, index) => (
						<div
							key={index}
							className="flex items-center gap-4 flex-1"
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 + index * 0.1 }}
								className="flex flex-col items-center gap-4 flex-1"
							>
								<div
									className={`w-16 h-16 rounded-2xl glass flex items-center justify-center ${step.color} glow-primary`}
								>
									<step.icon className="w-8 h-8" />
								</div>
								<div className="text-center">
									<h4 className="font-display font-semibold mb-1">
										{step.title}
									</h4>
									<p className="text-sm text-muted-foreground">
										{step.description}
									</p>
								</div>
							</motion.div>

							{index < steps.length - 1 && (
								<ArrowRight className="w-6 h-6 text-muted-foreground shrink-0" />
							)}
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
};
