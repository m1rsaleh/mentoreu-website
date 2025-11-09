import DynamicHero from '../components/DynamicHero';
import DynamicFeatures from '../components/DynamicFeatures';
import DynamicHowItWorks from '../components/DynamicHowItWorks';
import DynamicLeadForm from '../components/DynamicLeadForm';
import DynamicFAQ from '../components/DynamicFAQ';
import DynamicFooter from '../components/DynamicFooter';
import Header from '../components/Header';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DynamicHero />
      <DynamicFeatures />
      <DynamicHowItWorks />
      <DynamicLeadForm />
      <DynamicFAQ />
      <DynamicFooter />
    </div>
  );
}
