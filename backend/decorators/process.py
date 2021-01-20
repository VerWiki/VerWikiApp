import time

def Process(process):
	'''This is a decorator that marks a process'''
	def analyze():
		begin_time = time.perf_counter()
		process()
		end_time = time.perf_counter()
		lapsed_time = end_time - begin_time
		print("The total lapsed time was " + str(lapsed_time) + " seconds")
	return analyze
