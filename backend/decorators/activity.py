import time
def Activity(activity):
	def analyze():
		begin_time = time.perf_counter()
		activity()
		end_time = time.perf_counter()
		lapsed_time = end_time - begin_time
	return analyze	
