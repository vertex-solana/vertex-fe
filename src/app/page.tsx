'use client';

import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import NotFound from '@/components/layout/not-found';
import Home from '@/components/layout/home';

function Router() {
	return (
		<Switch>
			<Route path="/" component={Home} />
			<Route component={NotFound} />
		</Switch>
	);
}

const App = () => {
	return (
		<div id="home">
			<Router />
			<Toaster />
		</div>
	);
};

export default App;
